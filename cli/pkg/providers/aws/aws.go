package aws

import (
	"cli/pkg/console"
	"cli/pkg/kube"
	"cli/pkg/workspace"
	"context"
	"fmt"
	"io"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"math/rand"
	"os"
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
)

var letters = []rune("abcdefghijklmnopqrstuvwxyz")

type provider struct {
	context   kube.KubeCtx
	w         io.Writer
	ec2Client *ec2.Client
	iamClient *iam.Client
	eksClient *eks.Client
}

func New(w io.Writer) *provider {
	return &provider{
		w: w,
	}
}

func (a *provider) GetHelmOverrides() []string {
	return []string{"--set", "global.ngrokEnabled=false"}
}

func (a *provider) PostInstallation(namespace string) error {
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

func (a *provider) Provision(dir workspace.ConfigDir) (kube.KubeCtx, error) {
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		console.Exit(err)
	}

	id := RandString(8)
	name := "Airy-" + id
	fmt.Fprintf(a.w, "Creating Airy Core instance with id: %s\n", name)
	a.iamClient = iam.NewFromConfig(cfg)

	role, err := a.createRole(name)
	if err != nil {
		console.Exit("Error creating role: ", err)
	}
	fmt.Fprintf(a.w, "Created AWS Role with ARN: %s.\n", *role.Arn)

	if err = a.attachPolicies(role.RoleName); err != nil {
		console.Exit("Error attaching policies: ", err)
	}

	fmt.Fprintf(a.w, "EKS policies attached.\n")

	a.ec2Client = ec2.NewFromConfig(cfg)
	vpc, err := a.createVpc("192.168.0.0/16", name)

	if err != nil {
		console.Exit("Error creating vpc: ", err)
	}

	VpcId := vpc.VpcId
	fmt.Fprintf(a.w, "VPC created with id: %s\n", *VpcId)

	fmt.Fprintf(a.w, "Enabling DNS on VPC\n")
	if err = a.enableDNSOnVpc(VpcId); err != nil {
		console.Exit("Error enabling DNS on VPC", err)
	}

	fmt.Fprintf(a.w, "Creating Internet Gateway\n")
	internetGateway, err := a.createInternetGateway(VpcId)
	if err != nil {
		console.Exit("Could not create internet gateway: ", err)
	}

	fmt.Fprintf(a.w, "Creating route Table\n")
	routeTable, err := a.createRoute(VpcId, name, internetGateway)
	if err != nil {
		console.Exit("Error creating route table: ", err)
	}

	fmt.Fprintf(a.w, "Creating first subnet\n")
	firstSubnet, err := a.createSubnet(VpcId, name, "192.168.64.0/18", "us-east-1a")
	if err != nil {
		console.Exit("Error creating subnet: ", err)
	}

	fmt.Fprintf(a.w, "Creating second subnet\n")
	secondSubnet, err := a.createSubnet(VpcId, name, "192.168.128.0/18", "us-east-1b")
	if err != nil {
		console.Exit("Error creating subnet: ", err)
	}

	fmt.Fprintf(a.w, "Allowing public IP on first subnet\n")
	if err = a.allowPublicIpOnSubnet(firstSubnet.SubnetId); err != nil {
		console.Exit("Error allowing public IP on first subnet: ", err)
	}

	fmt.Fprintf(a.w, "Allowing public IP on second subnet\n")
	if err = a.allowPublicIpOnSubnet(secondSubnet.SubnetId); err != nil {
		console.Exit("Error allowing public IP on second subnet: ", err)
	}

	fmt.Fprintf(a.w, "Associating first subnet to route table\n")
	if err = a.associateSubnetToRouteTable(firstSubnet.SubnetId, routeTable.RouteTableId); err != nil {
		console.Exit("Error associating first subnet to route rable: ", err)
	}

	fmt.Fprintf(a.w, "Associating second subnet to route table\n")
	if err = a.associateSubnetToRouteTable(secondSubnet.SubnetId, routeTable.RouteTableId); err != nil {
		console.Exit("Error associating second subnet to route rable: ", err)
	}

	a.eksClient = eks.NewFromConfig(cfg)
	fmt.Fprintf(a.w, "Creating EKS cluster...\n")

	var subnetIds []string
	subnetIds = append(subnetIds, *firstSubnet.SubnetId)
	subnetIds = append(subnetIds, *secondSubnet.SubnetId)

	cluster, err := a.createCluster(name, role.Arn, subnetIds)
	if err != nil {
		console.Exit("Error creating cluster: ", err)
	}
	fmt.Fprintf(a.w, "Created EKS cluster named: %s\n", *cluster.Name)

	fmt.Fprintf(a.w, "Waiting for cluster to be ready...\n")
	a.waitUntilResourceReady(func() bool {
		describeClusterResult, err := a.eksClient.DescribeCluster(context.TODO(), &eks.DescribeClusterInput{
			Name: aws.String(name),
		})

		if err != nil {
			fmt.Fprintf(a.w, "Error fetching cluster information. Trying it again.\n")
			return false
		}

		return describeClusterResult.Cluster.Status == "ACTIVE"
	})

	nodeGroup, err := a.createNodeGroup(name, role.Arn, subnetIds)
	if err != nil {
		console.Exit("Error creating node group: ", err)
	}

	fmt.Fprintf(a.w, "Node group created %s.\n", *nodeGroup.NodegroupName)
	fmt.Fprintf(a.w, "Waiting for node group to be ready...\n")
	a.waitUntilResourceReady(func() bool {
		describeNodegroupResult, err := a.eksClient.DescribeNodegroup(context.TODO(), &eks.DescribeNodegroupInput{
			ClusterName:   aws.String(name),
			NodegroupName: aws.String(name),
		})

		if err != nil {
			fmt.Fprintf(a.w, "Error fetching node group information. Trying it again.")
			return false
		}

		return describeNodegroupResult.Nodegroup.Status == "ACTIVE"
	})

	describeClusterResult, err := a.eksClient.DescribeCluster(context.TODO(), &eks.DescribeClusterInput{
		Name: aws.String(name),
	})
	if err != nil {
		console.Exit("Error describing cluster: ", err)
	}

	cluster = describeClusterResult.Cluster
	kubeConfig := KubeConfig{
		ClusterName:     name,
		EndpointUrl:     *cluster.Endpoint,
		CertificateData: *cluster.CertificateAuthority.Data,
	}
	kubeConfigFilePath, err := a.createKubeConfigFile(dir, kubeConfig)

	if err != nil {
		console.Exit("Error creating kube config file: ", err)
	}

	ctx := kube.KubeCtx{
		KubeConfigPath: kubeConfigFilePath,
		ContextName:    name,
	}

	a.context = ctx
	return ctx, nil
}

func (a *provider) createRole(name string) (*iamTypes.Role, error) {
	createRoleInput := &iam.CreateRoleInput{
		AssumeRolePolicyDocument: aws.String(RolePolicyDocument),
		Path:                     aws.String("/"),
		RoleName:                 aws.String(name),
	}
	iamResult, err := a.iamClient.CreateRole(context.TODO(), createRoleInput)

	if err != nil {
		return nil, err
	}

	return iamResult.Role, nil
}

func (a *provider) createVpc(cidr string, name string) (*ec2Types.Vpc, error) {
	vpcTagList := ec2Types.TagSpecification{
		ResourceType: ec2Types.ResourceTypeVpc,
		Tags: []ec2Types.Tag{
			{
				Key: aws.String("Name"), Value: aws.String(name),
			},
		},
	}

	createVpcResult, err := a.ec2Client.CreateVpc(context.TODO(), &ec2.CreateVpcInput{
		CidrBlock:         aws.String(cidr),
		TagSpecifications: []ec2Types.TagSpecification{vpcTagList},
	})

	if err != nil {
		return nil, err
	}
	return createVpcResult.Vpc, nil
}

func (a *provider) enableDNSOnVpc(vpcId *string) error {
	_, err := a.ec2Client.ModifyVpcAttribute(context.TODO(), &ec2.ModifyVpcAttributeInput{
		VpcId: vpcId,
		EnableDnsSupport: &ec2Types.AttributeBooleanValue{
			Value: true,
		},
	})

	if err != nil {
		return err
	}

	_, err = a.ec2Client.ModifyVpcAttribute(context.TODO(), &ec2.ModifyVpcAttributeInput{
		VpcId: vpcId,
		EnableDnsHostnames: &ec2Types.AttributeBooleanValue{
			Value: true,
		},
	})

	return err
}

func (a *provider) createInternetGateway(vpcId *string) (*ec2Types.InternetGateway, error) {
	createInternetGatewayResult, err := a.ec2Client.CreateInternetGateway(context.TODO(), &ec2.CreateInternetGatewayInput{})
	if err != nil {
		return nil, err
	}

	_, err = a.ec2Client.AttachInternetGateway(context.TODO(), &ec2.AttachInternetGatewayInput{
		InternetGatewayId: createInternetGatewayResult.InternetGateway.InternetGatewayId,
		VpcId:             vpcId,
	})
	if err != nil {
		return nil, err
	}
	return createInternetGatewayResult.InternetGateway, nil
}

func (a *provider) createRoute(vpcId *string, name string, internetGateway *ec2Types.InternetGateway) (*ec2Types.RouteTable, error) {
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
	createRouteTable, err := a.ec2Client.CreateRouteTable(context.TODO(), &ec2.CreateRouteTableInput{
		VpcId:             vpcId,
		TagSpecifications: []ec2Types.TagSpecification{routeTableTagList},
	})
	if err != nil {
		return nil, err
	}
	_, err = a.ec2Client.CreateRoute(context.TODO(), &ec2.CreateRouteInput{
		RouteTableId:         createRouteTable.RouteTable.RouteTableId,
		DestinationCidrBlock: aws.String("0.0.0.0/0"),
		GatewayId:            internetGateway.InternetGatewayId,
	})

	if err != nil {
		return nil, err
	}
	return createRouteTable.RouteTable, nil
}

func (a *provider) createSubnet(vpcId *string, name string, cidr string, region string) (*ec2Types.Subnet, error) {
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
	subnetResult, err := a.ec2Client.CreateSubnet(context.TODO(), &ec2.CreateSubnetInput{
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

func (a *provider) allowPublicIpOnSubnet(subnetId *string) error {
	_, err := a.ec2Client.ModifySubnetAttribute(context.TODO(), &ec2.ModifySubnetAttributeInput{
		SubnetId: subnetId,
		MapPublicIpOnLaunch: &ec2Types.AttributeBooleanValue{
			Value: true,
		},
	})

	return err
}

func (a *provider) associateSubnetToRouteTable(subnetId *string, routeTableId *string) error {
	_, err := a.ec2Client.AssociateRouteTable(context.TODO(), &ec2.AssociateRouteTableInput{
		RouteTableId: routeTableId,
		SubnetId:     subnetId,
	})

	return err
}

func (a *provider) createCluster(name string, roleArn *string, subnetIds []string) (*eksTypes.Cluster, error) {
	createdCluster, err := a.eksClient.CreateCluster(context.TODO(), &eks.CreateClusterInput{
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

func (a *provider) createNodeGroup(name string, roleArn *string, subnetIds []string) (*eksTypes.Nodegroup, error) {
	tagKey := "kubernetes.io/cluster/" + name
	createdNodeGroup, err := a.eksClient.CreateNodegroup(context.TODO(), &eks.CreateNodegroupInput{
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

func (a *provider) createKubeConfigFile(dir workspace.ConfigDir, kubeConfig KubeConfig) (string, error) {
	tmpl, err := template.New("kube-template").Parse(KubeConfigTemplate)
	if err != nil {
		console.Exit("error parsing template", err)
	}

	path := dir.GetPath("kube.conf")
	kubeConfigFile, err := os.Create(path)
	defer kubeConfigFile.Close()

	if err != nil {
		return "", err
	}
	return path, tmpl.Execute(kubeConfigFile, kubeConfig)
}

func (a *provider) updateIngress(ingressName string, loadBalancerUrl string, namespace string) error {
	clientset, err := a.context.GetClientSet()
	if err != nil {
		return err
	}

	ingress, err := clientset.ExtensionsV1beta1().Ingresses(namespace).Get(context.TODO(), ingressName, metav1.GetOptions{})
	if err != nil {
		return err
	}

	ingress.Spec.Rules[0].Host = loadBalancerUrl
	ingress, err = clientset.ExtensionsV1beta1().Ingresses(namespace).Update(context.TODO(), ingress, metav1.UpdateOptions{})
	return err
}

func (a *provider) updateHostsConfigMap(loadBalancerUrl string, namespace string) error {
	clientset, err := a.context.GetClientSet()
	if err != nil {
		return err
	}

	configMaps := clientset.CoreV1().ConfigMaps(namespace)
	configMap, err := configMaps.Get(context.TODO(), "hostnames", metav1.GetOptions{})
	if err != nil {
		return err
	}

	configMap.Data["HOST"] = "http://" + loadBalancerUrl
	_, err = configMaps.Update(context.TODO(), configMap, metav1.UpdateOptions{})

	return err
}

func (a *provider) attachPolicies(roleName *string) error {
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
		_, errAttach := a.iamClient.AttachRolePolicy(context.TODO(), policyInput)
		if errAttach != nil {
			fmt.Fprintf(a.w, "%v\n", errAttach.Error())
			return errAttach
		}
	}

	return nil
}

func (a *provider) waitUntilResourceReady(f func() bool) {
	timeout := time.After(20 * time.Minute)
	tick := time.Tick(500 * time.Millisecond)
	for {
		select {
		case <-tick:
			if f() {
				return
			}
		case <-timeout:
			fmt.Fprintf(a.w, "Timeout when checking if resource is ready\n")
			return
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
