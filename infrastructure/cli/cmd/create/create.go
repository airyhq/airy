package create

import (
	"context"
	"fmt"
	"log"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/ec2"
	"github.com/aws/aws-sdk-go-v2/service/eks"
	"github.com/aws/aws-sdk-go-v2/service/eks/types"
	"github.com/aws/aws-sdk-go-v2/service/iam"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/spf13/cobra"
)

const awsIamEksPolicy = `{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "autoscaling:DescribeAutoScalingGroups",
                "autoscaling:UpdateAutoScalingGroup",
                "ec2:AttachVolume",
                "ec2:AuthorizeSecurityGroupIngress",
                "ec2:CreateRoute",
                "ec2:CreateSecurityGroup",
                "ec2:CreateTags",
                "ec2:CreateVolume",
                "ec2:DeleteRoute",
                "ec2:DeleteSecurityGroup",
                "ec2:DeleteVolume",
                "ec2:DescribeInstances",
                "ec2:DescribeRouteTables",
                "ec2:DescribeSecurityGroups",
                "ec2:DescribeSubnets",
                "ec2:DescribeVolumes",
                "ec2:DescribeVolumesModifications",
                "ec2:DescribeVpcs",
                "ec2:DescribeDhcpOptions",
                "ec2:DescribeNetworkInterfaces",
                "ec2:DetachVolume",
                "ec2:ModifyInstanceAttribute",
                "ec2:ModifyVolume",
                "ec2:RevokeSecurityGroupIngress",
                "elasticloadbalancing:AddTags",
                "elasticloadbalancing:ApplySecurityGroupsToLoadBalancer",
                "elasticloadbalancing:AttachLoadBalancerToSubnets",
                "elasticloadbalancing:ConfigureHealthCheck",
                "elasticloadbalancing:CreateListener",
                "elasticloadbalancing:CreateLoadBalancer",
                "elasticloadbalancing:CreateLoadBalancerListeners",
                "elasticloadbalancing:CreateLoadBalancerPolicy",
                "elasticloadbalancing:CreateTargetGroup",
                "elasticloadbalancing:DeleteListener",
                "elasticloadbalancing:DeleteLoadBalancer",
                "elasticloadbalancing:DeleteLoadBalancerListeners",
                "elasticloadbalancing:DeleteTargetGroup",
                "elasticloadbalancing:DeregisterInstancesFromLoadBalancer",
                "elasticloadbalancing:DeregisterTargets",
                "elasticloadbalancing:DescribeListeners",
                "elasticloadbalancing:DescribeLoadBalancerAttributes",
                "elasticloadbalancing:DescribeLoadBalancerPolicies",
                "elasticloadbalancing:DescribeLoadBalancers",
                "elasticloadbalancing:DescribeTargetGroupAttributes",
                "elasticloadbalancing:DescribeTargetGroups",
                "elasticloadbalancing:DescribeTargetHealth",
                "elasticloadbalancing:DetachLoadBalancerFromSubnets",
                "elasticloadbalancing:ModifyListener",
                "elasticloadbalancing:ModifyLoadBalancerAttributes",
                "elasticloadbalancing:ModifyTargetGroup",
                "elasticloadbalancing:ModifyTargetGroupAttributes",
                "elasticloadbalancing:RegisterInstancesWithLoadBalancer",
                "elasticloadbalancing:RegisterTargets",
                "elasticloadbalancing:SetLoadBalancerPoliciesForBackendServer",
                "elasticloadbalancing:SetLoadBalancerPoliciesOfListener",
                "kms:DescribeKey"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": "iam:CreateServiceLinkedRole",
            "Resource": "*",
            "Condition": {
                "StringLike": {
                    "iam:AWSServiceName": "elasticloadbalancing.amazonaws.com"
                }
            }
        }
    ]
}`

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

	iamClient := iam.NewFromConfig(cfg)
	// roleName := string("role-name")
	// createIamResult, err := iamClient.CreateRole(context.TODO(), &iam.CreateRoleInput{})
	input := &iam.CreateRoleInput{
		AssumeRolePolicyDocument: aws.String(awsIamEksPolicy),
		Path:                     aws.String("/"),
		RoleName:                 aws.String("Airy-Core-EKS-Role"),
	}

	iamResult, err := iamClient.CreateRole(context.TODO(), input)
	if err != nil {
		fmt.Println(err.Error())
	} else {
		fmt.Println(iamResult)
	}

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
	log.Printf("VPC created with id: %s\n", *VpcId)
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
	roleArn := iamResult.Role.Arn
	var subnetIds []string
	subnetIds = append(subnetIds, *createFirstSubnetResult.Subnet.SubnetId)
	subnetIds = append(subnetIds, *createSecondSubnetResult.Subnet.SubnetId)
	_, err = client.CreateCluster(context.TODO(), &eks.CreateClusterInput{
		Name:    &clusterName,
		RoleArn: roleArn,
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
