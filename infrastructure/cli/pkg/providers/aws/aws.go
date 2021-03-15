package aws

import (
	"cli/pkg/kube"
	"context"
	"fmt"
	"log"
	"math/rand"
	"os"
	"time"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/ec2"
	"github.com/aws/aws-sdk-go-v2/service/eks"
	"github.com/aws/aws-sdk-go-v2/service/eks/types"
	"github.com/aws/aws-sdk-go-v2/service/iam"
	"github.com/aws/aws-sdk-go/aws"
)

const RolePolicyDocument = `{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Effect": "Allow",
			"Principal": {"Service": "eks.amazonaws.com"},
			"Action": "sts:AssumeRole"
		}
	]
}`

var letters = []rune("abcdefghijklmnopqrstuvwxyz")

type Aws struct {
}

func (a *Aws) Provision() (kube.KubeCtx, error) {
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		log.Fatal(err)
	}

	id := RandString(8)
	iamClient := iam.NewFromConfig(cfg)
	input := &iam.CreateRoleInput{
		AssumeRolePolicyDocument: aws.String(RolePolicyDocument),
		Path:                     aws.String("/"),
		RoleName:                 aws.String("Airy-EKS-Role"),
	}
	iamResult, err := iamClient.CreateRole(context.TODO(), input)
	if err != nil {
		fmt.Println(err.Error())
	} else {
		fmt.Printf("Created AWS Role with ARN: %s.\n", *iamResult.Role.Arn)
	}
	policyInput := &iam.AttachRolePolicyInput{
		RoleName:  iamResult.Role.RoleName,
		PolicyArn: aws.String("arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"),
	}
	_, errAttach := iamClient.AttachRolePolicy(context.TODO(), policyInput)
	if errAttach != nil {
		fmt.Printf("%v\n", errAttach.Error())
	} else {
		fmt.Printf("EKS policy attached.\n")
	}

	ec2Client := ec2.NewFromConfig(cfg)
	CidrBlock := string("10.0.0.0/16")

	log.Printf("Creating VPC...\n")
	createVpcResult, err := ec2Client.CreateVpc(context.TODO(), &ec2.CreateVpcInput{
		CidrBlock: &CidrBlock,
	})

	if err != nil {
		log.Fatal(err)
	}

	VpcId := createVpcResult.Vpc.VpcId
	log.Printf("VPC created with id: %s\n", *VpcId)

	log.Printf("Creating first subnet...")
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

	log.Printf("Creating second Subnet...")
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

	eksClient := eks.NewFromConfig(cfg)
	log.Printf("Creating EKS cluster...")

	clusterName := "Airy-" + id
	roleArn := iamResult.Role.Arn
	var subnetIds []string
	subnetIds = append(subnetIds, *createFirstSubnetResult.Subnet.SubnetId)
	subnetIds = append(subnetIds, *createSecondSubnetResult.Subnet.SubnetId)
	createdCluster, clusterErr := eksClient.CreateCluster(context.TODO(), &eks.CreateClusterInput{
		Name:    &clusterName,
		RoleArn: roleArn,
		ResourcesVpcConfig: &types.VpcConfigRequest{
			SubnetIds: subnetIds,
		},
	})

	if clusterErr != nil {
		log.Fatal(clusterErr)

	} else {
		fmt.Printf("Created EKS cluster %s\n", *createdCluster.Cluster.Name)
	}

	clusterReady := make(chan bool, 1)
	go CheckClusterReady(eksClient, clusterName, clusterReady)

	<-clusterReady

	craetedNodeGroup, nodeGroupErr := eksClient.CreateNodegroup(context.TODO(), &eks.CreateNodegroupInput{
		AmiType:       "AL2_x86_64",
		ClusterName:   createdCluster.Cluster.Name,
		InstanceTypes: []string{"c5.xlarge"},
		NodeRole:      roleArn,
		NodegroupName: aws.String("Airy"),
		Subnets:       subnetIds,
	})

	if nodeGroupErr != nil {
		log.Fatal(nodeGroupErr)
	} else {
		fmt.Printf("Node group created %s.\n", *craetedNodeGroup.Nodegroup.NodegroupName)
	}

	fmt.Printf("AWS provider not yet implemented\n")
	os.Exit(1)
	return kube.KubeCtx{}, nil
}

func RandString(n int) string {
	b := make([]rune, n)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}

func CheckClusterReady(eksClient *eks.Client, clusterName string, clusterReady chan bool) {
	fmt.Print("Waiting for cluster to be ready...\n")

	for {
		describeClusterResult, err := eksClient.DescribeCluster(context.TODO(), &eks.DescribeClusterInput{
			Name: &clusterName,
		})

		if err != nil {
			fmt.Printf("Error fetching cluster information\n")
			os.Exit(1)
		}

		if describeClusterResult.Cluster.Status == "ACTIVE" {
			fmt.Print("Cluster is ready\n")
			clusterReady <- true
		} else {
			time.Sleep(time.Second)
		}
	}

}
