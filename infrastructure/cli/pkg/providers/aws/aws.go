package aws

import (
	"cli/pkg/kube"
	"context"
	"fmt"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/ec2"
	"log"
	"os"
)

type Aws struct {
}

func (a *Aws) Provision() (kube.KubeCtx, error) {
	fmt.Println("Starting AWS provisioning")
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		fmt.Println("Error while getting config")
		os.Exit(1)
	}

	ec2Client := ec2.NewFromConfig(cfg)
	CidrBlock := string("10.0.0.0/16")

	log.Println("Creating VPC")
	createVpcResult, err := ec2Client.CreateVpc(context.TODO(), &ec2.CreateVpcInput{
		CidrBlock: &CidrBlock,
	})

	if err != nil {
		fmt.Println("Error while creating VPC")
		os.Exit(1)
	}

	return kube.KubeCtx{}, nil
}
