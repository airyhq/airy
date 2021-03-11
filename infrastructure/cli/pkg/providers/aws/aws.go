package aws

import (
	"cli/pkg/kube"
	"context"
	"fmt"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/ec2"
	"os"
)

type Aws struct {
}

func (a *Aws) Provision() (kube.KubeCtx, error) {
	// Use this to
	//clientcmd.NewNonInteractiveClientConfig()
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("aws provider not yet implemented")
	os.Exit(1)
	return kube.KubeCtx{}, nil
}
