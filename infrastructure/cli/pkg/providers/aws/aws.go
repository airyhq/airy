package aws

import (
	"cli/pkg/console"
	"cli/pkg/kube"
	"context"
	"fmt"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"math/rand"
	"os"
	"path"
	"text/template"
	"time"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/ec2"
	ec2Types "github.com/aws/aws-sdk-go-v2/service/ec2/types"
	"github.com/aws/aws-sdk-go-v2/service/eks"
	eksTypes "github.com/aws/aws-sdk-go-v2/service/eks/types"
	"github.com/aws/aws-sdk-go-v2/service/iam"
	iamTypes "github.com/aws/aws-sdk-go-v2/service/iam/types"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/mitchellh/go-homedir"
)

var letters = []rune("abcdefghijklmnopqrstuvwxyz")

type Aws struct {
	context kube.KubeCtx
}

func (a *Aws) GetHelmOverrides() []string {
	return []string{"--set", "global.ngrokEnabled=false"}
}

func (a *Aws) PostInstallation(namespace string) error {
	clientset, err := a.context.GetClientSet()
	if err != nil {
		return err
	}

	ingressService, err := clientset.CoreV1().Services("kube-system").Get(context.TODO(), "traefik", metav1.GetOptions{})
	if err != nil {
		return err
	}

	loadBalancerUrl := ingressService.Status.LoadBalancer.Ingress[0].Hostname

	if err = a.updateIngress("airy-core", loadBalancerUrl, namespace); err != nil {
		return err
	}
	if err = a.updateIngress("airy-core-ui", loadBalancerUrl, namespace); err != nil {
		return err
	}

	if err = a.updateHostsConfigMap(loadBalancerUrl, namespace); err != nil {
		return err
	}

	return nil
}

type KubeConfig struct {
	ClusterName     string
	EndpointUrl     string
	CertificateData string
}

func (a *Aws) Provision() (kube.KubeCtx, error) {
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}

	id := RandString(8)
	name := "Airy-" + id
	fmt.Printf("Creating Airy Core instance with id: %s\n", name)
	iamClient := iam.NewFromConfig(cfg)

	role, err := a.createRole(iamClient, name)
	if err != nil {
		console.Exit("Error creating role: ", err)
	}
	fmt.Printf("Created AWS Role with ARN: %s.\n", *role.Arn)

	if err = a.attachPolicies(iamClient, role.RoleName); err != nil {
		console.Exit("Error attaching policies: ", err)
	}

	fmt.Printf("EKS policies attached.\n")

	ec2Client := ec2.NewFromConfig(cfg)
	vpc, err := a.createVpc(ec2Client, "192.168.0.0/16", name)

	if err != nil {
		console.Exit("Error creating vpc: ", err)
	}

	VpcId := vpc.VpcId
	fmt.Printf("VPC created with id: %s\n", *VpcId)

	fmt.Print("Enabling DNS on VPC\n")
	if err = a.enableDNSOnVpc(ec2Client, VpcId); err != nil {
		console.Exit("Error enabling DNS on VPC", err)
	}

	fmt.Print("Creating Internet Gateway\n")
	internetGateway, err := a.createInternetGateway(ec2Client, VpcId)
	if err != nil {
		console.Exit("Could not create internet gateway: ", err)
	}

	fmt.Print("Creating route Table\n")
	routeTable, err := a.createRoute(ec2Client, VpcId, name, internetGateway)
	if err != nil {
		console.Exit("Error creating route table: ", err)
	}

	fmt.Print("Creating first subnet\n")
	firstSubnet, err := a.createSubnet(ec2Client, VpcId, name, "192.168.64.0/18", "us-east-1a")
	if err != nil {
		console.Exit("Error creating subnet: ", err)
	}

	fmt.Print("Creating second subnet\n")
	secondSubnet, err := a.createSubnet(ec2Client, VpcId, name, "192.168.128.0/18", "us-east-1b")
	if err != nil {
		console.Exit("Error creating subnet: ", err)
	}

	fmt.Print("Allowing public IP on first subnet\n")
	if err = a.allowPublicIpOnSubnet(ec2Client, firstSubnet.SubnetId); err != nil {
		console.Exit("Error allowing public IP on first subnet: ", err)
	}

	fmt.Print("Allowing public IP on second subnet\n")
	if err = a.allowPublicIpOnSubnet(ec2Client, secondSubnet.SubnetId); err != nil {
		console.Exit("Error allowing public IP on second subnet: ", err)
	}

	fmt.Print("Associating first subnet to route table\n")
	if err = a.associateSubnetToRouteTable(ec2Client, firstSubnet.SubnetId, routeTable.RouteTableId); err != nil {
		console.Exit("Error associating first subnet to route rable: ", err)
	}

	fmt.Print("Associating second subnet to route table\n")
	if err = a.associateSubnetToRouteTable(ec2Client, secondSubnet.SubnetId, routeTable.RouteTableId); err != nil {
		console.Exit("Error associating second subnet to route rable: ", err)
	}

	eksClient := eks.NewFromConfig(cfg)
	fmt.Print("Creating EKS cluster...\n")

	var subnetIds []string
	subnetIds = append(subnetIds, *firstSubnet.SubnetId)
	subnetIds = append(subnetIds, *secondSubnet.SubnetId)

	cluster, err := a.createCluster(eksClient, name, role.Arn, subnetIds)
	if err != nil {
		console.Exit("Error creating cluster: ", err)
	}
	fmt.Printf("Created EKS cluster named: %s\n", *cluster.Name)

	clusterReady := make(chan bool, 1)
	go a.checkClusterReady(eksClient, name, clusterReady)
	<-clusterReady

	nodeGroup, err := a.createNodeGroup(eksClient, name, role.Arn, subnetIds)
	if err != nil {
		console.Exit("Error creating node group: ", err)
	}

	fmt.Printf("Node group created %s.\n", *nodeGroup.NodegroupName)

	nodeGroupReady := make(chan bool, 1)
	go a.checkNodeGroupReady(eksClient, name, *nodeGroup.NodegroupName, nodeGroupReady)
	<-nodeGroupReady

	describeClusterResult, err := eksClient.DescribeCluster(context.TODO(), &eks.DescribeClusterInput{
		Name: aws.String(name),
	})
	if err != nil {
		console.Exit("Error describing cluster: ", err)
	}

	cluster = describeClusterResult.Cluster
	kubeConfigFilePath, err := a.createKubeConfigFile(name, cluster.Endpoint, cluster.CertificateAuthority.Data)

	ctx := kube.KubeCtx{
		KubeConfigPath: kubeConfigFilePath,
		ContextName:    name,
	}

	a.context = ctx
	return ctx, nil
}

func (a *Aws) createRole(iamClient *iam.Client, name string) (*iamTypes.Role, error) {
	createRoleInput := &iam.CreateRoleInput{
		AssumeRolePolicyDocument: aws.String(RolePolicyDocument),
		Path:                     aws.String("/"),
		RoleName:                 aws.String(name),
	}
	iamResult, err := iamClient.CreateRole(context.TODO(), createRoleInput)

	if err != nil {
		return nil, err
	}

	return iamResult.Role, nil
}

func (a *Aws) createVpc(ec2Client *ec2.Client, cidr string, name string) (*ec2Types.Vpc, error) {
	vpcTagList := ec2Types.TagSpecification{
		ResourceType: ec2Types.ResourceTypeVpc,
		Tags: []ec2Types.Tag{
			{
				Key: aws.String("Name"), Value: aws.String(name),
			},
		},
	}

	createVpcResult, err := ec2Client.CreateVpc(context.TODO(), &ec2.CreateVpcInput{
		CidrBlock:         aws.String(cidr),
		TagSpecifications: []ec2Types.TagSpecification{vpcTagList},
	})

	if err != nil {
		return nil, err
	}
	return createVpcResult.Vpc, nil
}

func (a *Aws) enableDNSOnVpc(ec2Client *ec2.Client, vpcId *string) error {
	_, err := ec2Client.ModifyVpcAttribute(context.TODO(), &ec2.ModifyVpcAttributeInput{
		VpcId: vpcId,
		EnableDnsSupport: &ec2Types.AttributeBooleanValue{
			Value: true,
		},
	})

	if err != nil {
		return err
	}

	_, err = ec2Client.ModifyVpcAttribute(context.TODO(), &ec2.ModifyVpcAttributeInput{
		VpcId: vpcId,
		EnableDnsHostnames: &ec2Types.AttributeBooleanValue{
			Value: true,
		},
	})
	if err != nil {
		return err
	}

	return nil
}

func (a *Aws) createInternetGateway(ec2Client *ec2.Client, vpcId *string) (*ec2Types.InternetGateway, error) {
	createInternetGatewayResult, err := ec2Client.CreateInternetGateway(context.TODO(), &ec2.CreateInternetGatewayInput{})
	if err != nil {
		return nil, err
	}

	_, err = ec2Client.AttachInternetGateway(context.TODO(), &ec2.AttachInternetGatewayInput{
		InternetGatewayId: createInternetGatewayResult.InternetGateway.InternetGatewayId,
		VpcId:             vpcId,
	})
	if err != nil {
		return nil, err
	}
	return createInternetGatewayResult.InternetGateway, nil
}

func (a *Aws) createRoute(ec2Client *ec2.Client, vpcId *string, name string, internetGateway *ec2Types.InternetGateway) (*ec2Types.RouteTable, error) {
	routeTableTagList := ec2Types.TagSpecification{
		ResourceType: ec2Types.ResourceTypeRouteTable,
		Tags: []ec2Types.Tag{
			{
				Key: aws.String("Network"), Value: aws.String("Public"),
			},
			{
				Key: aws.String("Id"), Value: aws.String(name),
			},
		},
	}
	createRouteTable, err := ec2Client.CreateRouteTable(context.TODO(), &ec2.CreateRouteTableInput{
		VpcId:             vpcId,
		TagSpecifications: []ec2Types.TagSpecification{routeTableTagList},
	})
	if err != nil {
		return nil, err
	}
	_, err = ec2Client.CreateRoute(context.TODO(), &ec2.CreateRouteInput{
		RouteTableId:         createRouteTable.RouteTable.RouteTableId,
		DestinationCidrBlock: aws.String("0.0.0.0/0"),
		GatewayId:            internetGateway.InternetGatewayId,
	})

	if err != nil {
		return nil, err
	}
	return createRouteTable.RouteTable, nil
}

func (a *Aws) createSubnet(ec2Client *ec2.Client, vpcId *string, name string, cidr string, region string) (*ec2Types.Subnet, error) {
	subnetTagList := ec2Types.TagSpecification{
		ResourceType: ec2Types.ResourceTypeSubnet,
		Tags: []ec2Types.Tag{
			{
				Key: aws.String("kubernetes.io/role/elb"), Value: aws.String("1"),
			},
			{
				Key: aws.String("Id"), Value: aws.String(name),
			},
		},
	}
	subnetResult, err := ec2Client.CreateSubnet(context.TODO(), &ec2.CreateSubnetInput{
		VpcId:             vpcId,
		CidrBlock:         aws.String(cidr),
		AvailabilityZone:  aws.String(region),
		TagSpecifications: []ec2Types.TagSpecification{subnetTagList},
	})
	if err != nil {
		return nil, err
	}

	return subnetResult.Subnet, nil

}

func (a *Aws) allowPublicIpOnSubnet(ec2Client *ec2.Client, subnetId *string) error {
	_, err := ec2Client.ModifySubnetAttribute(context.TODO(), &ec2.ModifySubnetAttributeInput{
		SubnetId: subnetId,
		MapPublicIpOnLaunch: &ec2Types.AttributeBooleanValue{
			Value: true,
		},
	})

	return err
}

func (a *Aws) associateSubnetToRouteTable(ec2Client *ec2.Client, subnetId *string, routeTableId *string) error {
	_, err := ec2Client.AssociateRouteTable(context.TODO(), &ec2.AssociateRouteTableInput{
		RouteTableId: routeTableId,
		SubnetId:     subnetId,
	})

	return err
}

func (a *Aws) createCluster(eksClient *eks.Client, name string, roleArn *string, subnetIds []string) (*eksTypes.Cluster, error) {
	createdCluster, err := eksClient.CreateCluster(context.TODO(), &eks.CreateClusterInput{
		Name:    aws.String(name),
		RoleArn: roleArn,
		Version: aws.String("1.19"),
		ResourcesVpcConfig: &eksTypes.VpcConfigRequest{
			SubnetIds: subnetIds,
		},
		Tags: map[string]string{"Id": name},
	})

	if err != nil {
		return nil, err
	}

	return createdCluster.Cluster, nil

}

func (a *Aws) createNodeGroup(eksClient *eks.Client, name string, roleArn *string, subnetIds []string) (*eksTypes.Nodegroup, error) {
	tagKey := "kubernetes.io/cluster/" + name
	createdNodeGroup, err := eksClient.CreateNodegroup(context.TODO(), &eks.CreateNodegroupInput{
		AmiType:       "AL2_x86_64",
		ClusterName:   aws.String(name),
		InstanceTypes: []string{"c5.xlarge"},
		NodeRole:      roleArn,
		NodegroupName: aws.String(name),
		Subnets:       subnetIds,
		Tags:          map[string]string{tagKey: "owned"},
	})

	if err != nil {
		return nil, err
	}

	return createdNodeGroup.Nodegroup, nil
}

func (a *Aws) createKubeConfigFile(name string, endpoint *string, certificateData *string) (string, error) {
	kubeConfig := KubeConfig{
		ClusterName:     name,
		EndpointUrl:     *endpoint,
		CertificateData: *certificateData,
	}

	tmpl, err := template.New("kube-template").Parse(KubeConfigTemplate)
	if err != nil {
		fmt.Println("error parsing template", err)
		os.Exit(1)
	}

	home, err := homedir.Dir()
	kubeConfigFilePath := path.Join(home, ".airy", "kube.conf")
	kubeConfigFile, err := os.Create(kubeConfigFilePath)
	defer kubeConfigFile.Close()

	if err != nil {
		return "", err
	}
	err = tmpl.Execute(kubeConfigFile, kubeConfig)

	if err != nil {
		return "", err
	}
	return kubeConfigFilePath, nil
}

func (a *Aws) updateIngress(ingressName string, loadBalancerUrl string, namespace string) error {
	clientset, err := a.context.GetClientSet()
	ingress, err := clientset.ExtensionsV1beta1().Ingresses(namespace).Get(context.TODO(), ingressName, metav1.GetOptions{})

	if err != nil {
		return err
	}

	ingress.Spec.Rules[0].Host = loadBalancerUrl

	ingress, err = clientset.ExtensionsV1beta1().Ingresses(namespace).Update(context.TODO(), ingress, metav1.UpdateOptions{})

	return err
}

func (a *Aws) updateHostsConfigMap(loadBalancerUrl string, namespace string) error {
	clientset, err := a.context.GetClientSet()
	if err != nil {
		return err
	}
	configMaps := clientset.CoreV1().ConfigMaps(namespace)

	configMap, err := configMaps.Get(context.TODO(), "hostnames", metav1.GetOptions{})

	if err != nil {
		return err
	}
	configMap.Data["HOST"] = "http://"+loadBalancerUrl
	_, err = configMaps.Update(context.TODO(), configMap, metav1.UpdateOptions{})

	return err
}

func (a *Aws) attachPolicies(iamClient *iam.Client, roleName *string) error {
	policies := [...]string{"arn:aws:iam::aws:policy/AmazonEKSClusterPolicy",
		"arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
		"arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly",
		"arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy",
	}

	for _, policyName := range policies {
		policyInput := &iam.AttachRolePolicyInput{
			RoleName:  roleName,
			PolicyArn: aws.String(policyName),
		}
		_, errAttach := iamClient.AttachRolePolicy(context.TODO(), policyInput)
		if errAttach != nil {
			fmt.Printf("%v\n", errAttach.Error())
			return errAttach
		}
	}

	return nil
}

func (a *Aws) checkClusterReady(eksClient *eks.Client, name string, clusterReady chan bool) {
	fmt.Print("Waiting for cluster to be ready...\n")

	for {
		describeClusterResult, err := eksClient.DescribeCluster(context.TODO(), &eks.DescribeClusterInput{
			Name: aws.String(name),
		})

		if err != nil {
			fmt.Printf("Error fetching cluster information\n")
			os.Exit(1)
		}

		if describeClusterResult.Cluster.Status == "ACTIVE" {
			clusterReady <- true
		} else {
			time.Sleep(time.Second)
		}
	}

}

func (a *Aws) checkNodeGroupReady(eksClient *eks.Client, name string, nodeGroupName string, nodeGroupReady chan bool) {
	fmt.Print("Waiting for node group to be ready...\n")
	for {
		describeNodegroupResult, err := eksClient.DescribeNodegroup(context.TODO(), &eks.DescribeNodegroupInput{
			ClusterName:   aws.String(name),
			NodegroupName: &nodeGroupName,
		})

		if err != nil {
			fmt.Printf("Error fetching node group information\n")
			os.Exit(1)
		}

		if describeNodegroupResult.Nodegroup.Status == "ACTIVE" {
			nodeGroupReady <- true
		} else {
			time.Sleep(time.Second)
		}
	}
}

func RandString(n int) string {
	rand.Seed(time.Now().UnixNano())
	b := make([]rune, n)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}
