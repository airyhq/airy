package minikube

import (
	"cli/pkg/k8s_cluster"
	"fmt"
	"os"
)

type Minikube struct {
}

func (m *Minikube) Provision() (k8s_cluster.Context, error) {
	// Use this to
	//clientcmd.NewNonInteractiveClientConfig()
	fmt.Println("minikube provider not yet implemented")
	os.Exit(1)
	return k8s_cluster.Context{}, nil
}

