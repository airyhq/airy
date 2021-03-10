package minikube

import (
	"cli/pkg/kube"
	"fmt"
	"os"
)

type Minikube struct {
}

func (m *Minikube) Provision() (kube.KubeCtx, error) {
	// Use this to
	//clientcmd.NewNonInteractiveClientConfig()
	fmt.Println("minikube provider not yet implemented")
	os.Exit(1)
	return kube.KubeCtx{}, nil
}


