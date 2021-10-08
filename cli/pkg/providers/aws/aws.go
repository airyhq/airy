package aws

import (
	"cli/pkg/console"
	"cli/pkg/kube"
	"cli/pkg/workspace"
	tmpl "cli/pkg/workspace/template"
	"context"
	"fmt"
	"io"
	"math/rand"
	"os"
	"strings"
	"text/template"
	"time"

	"gopkg.in/segmentio/analytics-go.v3"

	"github.com/TwinProduction/go-color"
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
	analytics console.AiryAnalytics
}

func New(w io.Writer, analytics *console.AiryAnalytics) *provider {
	return &provider{
		w:         w,
		analytics: *analytics,
	}
}

func (p *provider) GetOverrides() tmpl.Variables {
	return tmpl.Variables{
		LoadbalancerAnnotations: map[string]string{"service.beta.kubernetes.io/aws-load-balancer-type": "nlb"},
	}
}

func (p *provider) PostInstallation(providerConfig map[string]string, namespace string, dir workspace.ConfigDir) error {
	return nil
}

type KubeConfig struct {
	ClusterName     string
	EndpointUrl     string
	CertificateData string
}

func (p *provider) Provision(providerConfig map[string]string, dir workspace.ConfigDir) (kube.KubeCtx, error) {
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		console.Exit(err)
	}

	id := RandString(8)
	p.analytics.Track(analytics.Identify{
		UserId: id,
		Traits: analytics.NewTraits().
			Set("provider", "AWS"),
	})
	name := "Airy-" + id
	fmt.Fprintf(p.w, "Creating Airy Core instance with id: %s. This might take a while.\n", name)
	p.iamClient = iam.NewFromConfig(cfg)

	role, err := p.createRole(name)
	if err != nil {
		console.Exit("Error creating role: ", err)
	}
	fmt.Fprintf(p.w, "Created AWS Role with ARN: %s.\n", *role.Arn)

	if err = p.attachPolicies(role.RoleName); err != nil {
		console.Exit("Error attaching policies: ", err)
	}

	fmt.Fprintf(p.w, "EKS policies attached.\n")

	p.ec2Client = ec2.NewFromConfig(cfg)

	var subnetIds []string
	instanceType := providerConfig["instanceType"]
	if instanceType == "" {
		instanceType = "c5.xlarge"
	}

	vpcId := providerConfig["vpcId"]
	if vpcId == "" {
		vpc, err := p.createVpc("192.168.0.0/16", name)
		if err != nil {
			console.Exit("Error creating vpc: ", err)
		}
		vpcId = *vpc.VpcId
		fmt.Fprintf(p.w, "VPC created with id: %s.\n", vpcId)
		fmt.Fprintf(p.w, "Enabling DNS on VPC...\n")
		if err = p.enableDNSOnVpc(&vpcId); err != nil {
			console.Exit("Error enabling DNS on VPC.", err)
		}

		fmt.Fprintf(p.w, "Creating Internet Gateway...\n")
		internetGateway, err := p.createInternetGateway(&vpcId)
		if err != nil {
			console.Exit("Could not create internet gateway: ", err)
		}

		fmt.Fprintf(p.w, "Creating route table...\n")
		routeTable, err := p.createRoute(&vpcId, name, internetGateway)
		if err != nil {
			console.Exit("Error creating route table: ", err)
		}

		availabilityZones, azErr := p.ec2Client.DescribeAvailabilityZones(context.TODO(), &ec2.DescribeAvailabilityZonesInput{})
		if azErr != nil {
			console.Exit("Unable to get availability zones. Make sure you have set the ENV variable AWS_REGION")
		}
		fmt.Fprintf(p.w, "Creating first subnet...\n")
		firstSubnet, err := p.createSubnet(&vpcId, name, "192.168.64.0/18", *availabilityZones.AvailabilityZones[0].ZoneName)
		if err != nil {
			console.Exit("Error creating subnet: ", err)
		}

		fmt.Fprintf(p.w, "Creating second subnet\n")
		secondSubnet, err := p.createSubnet(&vpcId, name, "192.168.128.0/18", *availabilityZones.AvailabilityZones[1].ZoneName)
		if err != nil {
			console.Exit("Error creating subnet: ", err)
		}

		fmt.Fprintf(p.w, "Allowing public IP on first subnet...\n")
		if err = p.allowPublicIpOnSubnet(firstSubnet.SubnetId); err != nil {
			console.Exit("Error allowing public IP on first subnet: ", err)
		}

		fmt.Fprintf(p.w, "Allowing public IP on second subnet...\n")
		if err = p.allowPublicIpOnSubnet(secondSubnet.SubnetId); err != nil {
			console.Exit("Error allowing public IP on second subnet: ", err)
		}

		fmt.Fprintf(p.w, "Associating first subnet to route table...\n")
		if err = p.associateSubnetToRouteTable(firstSubnet.SubnetId, routeTable.RouteTableId); err != nil {
			console.Exit("Error associating first subnet to route table: ", err)
		}

		fmt.Fprintf(p.w, "Associating second subnet to route table...\n")
		if err = p.associateSubnetToRouteTable(secondSubnet.SubnetId, routeTable.RouteTableId); err != nil {
			console.Exit("Error associating second subnet to route table: ", err)
		}

		subnetIds = append(subnetIds, *firstSubnet.SubnetId)
		subnetIds = append(subnetIds, *secondSubnet.SubnetId)
	} else {
		fmt.Fprintf(p.w, "Using existing VPC: %s.\n", vpcId)
		subnets, subnetErr := p.getSubnets(vpcId)
		if subnetErr != nil {
			console.Exit("Unable to get subnets from VPC", subnetErr)
		}
		subnetIds = subnets
		fmt.Fprintf(p.w, "Using subnets: %s.\n", strings.Join(subnets[:], ","))
	}

	p.eksClient = eks.NewFromConfig(cfg)
	fmt.Fprintf(p.w, "Creating EKS cluster...\n")

	cluster, err := p.createCluster(name, role.Arn, subnetIds)
	if err != nil {
		console.Exit("Error creating cluster: ", err)
	}
	fmt.Fprintf(p.w, "Created EKS cluster named: %s.\n", *cluster.Name)

	fmt.Fprintf(p.w, "Waiting for cluster to be ready")
	p.waitUntilResourceReady(func() bool {
		describeClusterResult, err := p.eksClient.DescribeCluster(context.TODO(), &eks.DescribeClusterInput{
			Name: aws.String(name),
		})

		if err != nil {
			fmt.Fprintf(p.w, "Error fetching cluster information. Trying it again.\n")
			return false
		}

		return describeClusterResult.Cluster.Status == "ACTIVE"
	})

	nodeGroup, err := p.createNodeGroup(name, role.Arn, subnetIds, instanceType)
	if err != nil {
		console.Exit("Error creating node group: ", err)
	}

	fmt.Fprintf(p.w, "Node group created %s.\n", *nodeGroup.NodegroupName)
	fmt.Fprintf(p.w, "Waiting for node group to be ready")
	p.waitUntilResourceReady(func() bool {
		describeNodegroupResult, err := p.eksClient.DescribeNodegroup(context.TODO(), &eks.DescribeNodegroupInput{
			ClusterName:   aws.String(name),
			NodegroupName: aws.String(name),
		})

		if err != nil {
			fmt.Fprintf(p.w, "Error fetching node group information. Trying it again.")
			return false
		}

		return describeNodegroupResult.Nodegroup.Status == "ACTIVE"
	})

	describeClusterResult, err := p.eksClient.DescribeCluster(context.TODO(), &eks.DescribeClusterInput{
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
	kubeConfigFilePath, err := p.createKubeConfigFile(dir, kubeConfig)

	if err != nil {
		console.Exit("Error creating kube config file: ", err)
	}

	ctx := kube.KubeCtx{
		KubeConfigPath: kubeConfigFilePath,
		ContextName:    name,
	}

	p.context = ctx
	return ctx, nil
}

func (p *provider) createRole(name string) (*iamTypes.Role, error) {
	createRoleInput := &iam.CreateRoleInput{
		AssumeRolePolicyDocument: aws.String(RolePolicyDocument),
		Path:                     aws.String("/"),
		RoleName:                 aws.String(name),
	}
	iamResult, err := p.iamClient.CreateRole(context.TODO(), createRoleInput)

	if err != nil {
		return nil, err
	}

	return iamResult.Role, nil
}

func (p *provider) createVpc(cidr string, name string) (*ec2Types.Vpc, error) {
	vpcTagList := ec2Types.TagSpecification{
		ResourceType: ec2Types.ResourceTypeVpc,
		Tags: []ec2Types.Tag{
			{
				Key: aws.String("Name"), Value: aws.String(name),
			},
		},
	}

	createVpcResult, err := p.ec2Client.CreateVpc(context.TODO(), &ec2.CreateVpcInput{
		CidrBlock:         aws.String(cidr),
		TagSpecifications: []ec2Types.TagSpecification{vpcTagList},
	})

	if err != nil {
		return nil, err
	}
	return createVpcResult.Vpc, nil
}

func (p *provider) enableDNSOnVpc(vpcId *string) error {
	_, err := p.ec2Client.ModifyVpcAttribute(context.TODO(), &ec2.ModifyVpcAttributeInput{
		VpcId: vpcId,
		EnableDnsSupport: &ec2Types.AttributeBooleanValue{
			Value: true,
		},
	})

	if err != nil {
		return err
	}

	_, err = p.ec2Client.ModifyVpcAttribute(context.TODO(), &ec2.ModifyVpcAttributeInput{
		VpcId: vpcId,
		EnableDnsHostnames: &ec2Types.AttributeBooleanValue{
			Value: true,
		},
	})

	return err
}

func (p *provider) createInternetGateway(vpcId *string) (*ec2Types.InternetGateway, error) {
	createInternetGatewayResult, err := p.ec2Client.CreateInternetGateway(context.TODO(), &ec2.CreateInternetGatewayInput{})
	if err != nil {
		return nil, err
	}

	_, err = p.ec2Client.AttachInternetGateway(context.TODO(), &ec2.AttachInternetGatewayInput{
		InternetGatewayId: createInternetGatewayResult.InternetGateway.InternetGatewayId,
		VpcId:             vpcId,
	})
	if err != nil {
		return nil, err
	}
	return createInternetGatewayResult.InternetGateway, nil
}

func (p *provider) createRoute(vpcId *string, name string, internetGateway *ec2Types.InternetGateway) (*ec2Types.RouteTable, error) {
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
	createRouteTable, err := p.ec2Client.CreateRouteTable(context.TODO(), &ec2.CreateRouteTableInput{
		VpcId:             vpcId,
		TagSpecifications: []ec2Types.TagSpecification{routeTableTagList},
	})
	if err != nil {
		return nil, err
	}
	_, err = p.ec2Client.CreateRoute(context.TODO(), &ec2.CreateRouteInput{
		RouteTableId:         createRouteTable.RouteTable.RouteTableId,
		DestinationCidrBlock: aws.String("0.0.0.0/0"),
		GatewayId:            internetGateway.InternetGatewayId,
	})

	if err != nil {
		return nil, err
	}
	return createRouteTable.RouteTable, nil
}

func (p *provider) createSubnet(vpcId *string, name string, cidr string, availabilityZone string) (*ec2Types.Subnet, error) {
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
	subnetResult, err := p.ec2Client.CreateSubnet(context.TODO(), &ec2.CreateSubnetInput{
		VpcId:             vpcId,
		CidrBlock:         aws.String(cidr),
		AvailabilityZone:  aws.String(availabilityZone),
		TagSpecifications: []ec2Types.TagSpecification{subnetTagList},
	})
	if err != nil {
		return nil, err
	}

	return subnetResult.Subnet, nil

}

func (p *provider) getSubnets(vpcId string) ([]string, error) {
	var subnets []string
	result, err := p.ec2Client.DescribeSubnets(context.TODO(), &ec2.DescribeSubnetsInput{
		Filters: []ec2Types.Filter{
			{
				Name: aws.String("vpc-id"),
				Values: []string{
					*aws.String(vpcId),
				},
			},
		},
	})

	for i := range result.Subnets {
		if result.Subnets[i].MapPublicIpOnLaunch == true {
			subnets = append(subnets, *result.Subnets[i].SubnetId)
		}
	}
	return subnets, err
}

func (p *provider) allowPublicIpOnSubnet(subnetId *string) error {
	_, err := p.ec2Client.ModifySubnetAttribute(context.TODO(), &ec2.ModifySubnetAttributeInput{
		SubnetId: subnetId,
		MapPublicIpOnLaunch: &ec2Types.AttributeBooleanValue{
			Value: true,
		},
	})

	return err
}

func (p *provider) associateSubnetToRouteTable(subnetId *string, routeTableId *string) error {
	_, err := p.ec2Client.AssociateRouteTable(context.TODO(), &ec2.AssociateRouteTableInput{
		RouteTableId: routeTableId,
		SubnetId:     subnetId,
	})

	return err
}

func (p *provider) createCluster(name string, roleArn *string, subnetIds []string) (*eksTypes.Cluster, error) {
	createdCluster, err := p.eksClient.CreateCluster(context.TODO(), &eks.CreateClusterInput{
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

func (p *provider) createNodeGroup(name string, roleArn *string, subnetIds []string, instanceType string) (*eksTypes.Nodegroup, error) {
	tagKey := "kubernetes.io/cluster/" + name
	createdNodeGroup, err := p.eksClient.CreateNodegroup(context.TODO(), &eks.CreateNodegroupInput{
		AmiType:       "AL2_x86_64",
		ClusterName:   aws.String(name),
		InstanceTypes: []string{instanceType},
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

func (p *provider) createKubeConfigFile(dir workspace.ConfigDir, kubeConfig KubeConfig) (string, error) {
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

func (p *provider) attachPolicies(roleName *string) error {
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
		_, errAttach := p.iamClient.AttachRolePolicy(context.TODO(), policyInput)
		if errAttach != nil {
			fmt.Fprintf(p.w, "%v\n", errAttach.Error())
			return errAttach
		}
	}

	return nil
}

func (p *provider) waitUntilResourceReady(f func() bool) {
	timeout := time.After(20 * time.Minute)
	tick := time.Tick(10 * time.Second)
	l := console.GetMiddleware(func(input string) string {
		return color.Colorize(color.Cyan, input)
	})
	for {
		select {
		case <-tick:
			if f() {
				fmt.Fprintf(l, "\n")
				return
			}
			fmt.Fprintf(l, ".")
		case <-timeout:
			fmt.Fprintf(p.w, "Timeout when checking if resource is ready\n")
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
