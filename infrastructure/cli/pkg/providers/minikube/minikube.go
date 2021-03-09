package minikube

import (
	"cli/pkg/kube"
	"fmt"
	"os"
	"os/exec"
)

const minikube = "minikube"

type Minikube struct {
}

func (m *Minikube) Provision() (kube.KubeCtx, error) {
	mustBeInstalled()
	fmt.Println("minikube provider not yet implemented")
	os.Exit(1)
	return kube.KubeCtx{}, nil
}

func mustBeInstalled() {
	_, err := exec.LookPath(minikube)
	if err != nil {
		panic("could not find minikube installation. Please install Minikube from here https://github.com/kubernetes/minikube/releases")
	}
}

func startCluster
