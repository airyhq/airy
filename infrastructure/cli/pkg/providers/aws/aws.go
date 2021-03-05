package aws

import (
	"cli/pkg/k8s_cluster"
	"fmt"
	"os"
)

type Aws struct {
}

func (a *Aws) Provision() (k8s_cluster.Context, error) {
	// Use this to
	//clientcmd.NewNonInteractiveClientConfig()
	fmt.Println("minikube provider not yet implemented")
	os.Exit(1)
	return k8s_cluster.Context{}, nil
}
