package create

import (
	"context"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/ec2"
	"github.com/aws/aws-sdk-go-v2/service/eks"
	"github.com/aws/aws-sdk-go-v2/service/eks/types"
	"github.com/spf13/cobra"
	"log"
)

var CreateCmd = &cobra.Command{
	Use:   "create",
	Short: "Creates an AWS instance of the airy core",
	Long:  ``,
	Run:   create,
}

func create(cmd *cobra.Command, args []string) {
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		log.Fatal(err)
	}

	// iamClient := iam.NewFromConfig(cfg)
	// roleName := string("role-name")
	// createIamResult, err := iamClient.CreateRole(context.TODO(), &iam.CreateRoleInput{})

	ec2Client := ec2.NewFromConfig(cfg)
	CidrBlock := string("10.0.0.0/16")

	log.Println("Creating VPC")
	createVpcResult, err := ec2Client.CreateVpc(context.TODO(), &ec2.CreateVpcInput{
		CidrBlock: &CidrBlock,
	})

	if err != nil {
		log.Fatal(err)
	}
	VpcId := createVpcResult.Vpc.VpcId
	log.Println("creating first Subnet")
	CidrBlock = string("10.0.1.0/24")
	AvailabilityZone := string("us-east-1a")
	createFirstSubnetResult, err := ec2Client.CreateSubnet(context.TODO(), &ec2.CreateSubnetInput{
		CidrBlock:        &CidrBlock,
		VpcId:            VpcId,
		AvailabilityZone: &AvailabilityZone,
	})
	if err != nil {
		log.Fatal(err)
	}

	log.Println("creating second Subnet")
	CidrBlock = string("10.0.2.0/24")
	AvailabilityZone = string("us-east-1b")
	createSecondSubnetResult, err := ec2Client.CreateSubnet(context.TODO(), &ec2.CreateSubnetInput{
		CidrBlock:        &CidrBlock,
		VpcId:            VpcId,
		AvailabilityZone: &AvailabilityZone,
	})
	if err != nil {
		log.Fatal(err)
	}

	client := eks.NewFromConfig(cfg)
	log.Println("Creating cluster")

	clusterName := string("go-test")
	roleArn := string("arn:aws:iam::947726454442:role/eks_buildfarm_manager")
	var subnetIds []string
	subnetIds = append(subnetIds, *createFirstSubnetResult.Subnet.SubnetId)
	subnetIds = append(subnetIds, *createSecondSubnetResult.Subnet.SubnetId)
	_, err = client.CreateCluster(context.TODO(), &eks.CreateClusterInput{
		Name:    &clusterName,
		RoleArn: &roleArn,
		ResourcesVpcConfig: &types.VpcConfigRequest{
			SubnetIds: subnetIds,
		},
	})

	if err != nil {
		log.Fatal(err)
	}

	MaxResults := int32(10)
	output, err := client.ListClusters(context.TODO(), &eks.ListClustersInput{
		MaxResults: &MaxResults,
	})
	if err != nil {
		log.Fatal(err)
	}

	log.Println(output)

}
