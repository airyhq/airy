package create

import (
	"context"
	"github.com/aws/aws-sdk-go-v2/config"
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

	// log.Println("creating Subnet")
	// ec2Client := ec2.NewFromConfig(cfg)
	// VpcId := string("vpc-id")
	// CidrBlock := string("10.0.0.0/24")
	// _, err = ec2Client.CreateSubnet(context.TODO(), &ec2.CreateSubnetInput{
	// 	CidrBlock: &CidsBlock,
	// 	VpcId:     &VpcId,
	// })
	// if err != nil {
	// 	log.Fatal(err)
	// }

	client := eks.NewFromConfig(cfg)
	log.Println("Creating cluster")

	clusterName := string("go-test")
	roleArn := string("arn:aws:iam::947726454442:role/eks_buildfarm_manager")
	SubnetIds := []string{"subnet-02a33165", "subnet-faa43ba6"}
	_, err = client.CreateCluster(context.TODO(), &eks.CreateClusterInput{
		Name:    &clusterName,
		RoleArn: &roleArn,
		ResourcesVpcConfig: &types.VpcConfigRequest{
			SubnetIds: SubnetIds,
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
