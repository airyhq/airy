package providers

import (
	"cli/pkg/providers/aws"
	"cli/pkg/providers/minikube"
	"fmt"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"
	"os"
)

type Provider string

const (
	Local    Provider = "local"
	Minikube Provider = "minikube"
	Aws      Provider = "aws"
)

func GetProvider(providerName Provider) (*kubernetes.Clientset, error) {
	if providerName == Minikube {
		return minikube.Create()
	}

	if providerName == Aws {
		return aws.Create()
	}

	// TODO remove this provider in #1041
	if providerName == Local {
		config, err := clientcmd.BuildConfigFromFlags("", os.Getenv("KUBE_CONFIG_PATH"))
		if err != nil {
			fmt.Println("Building kubeconfig failed with error: ", err)
			os.Exit(1)
		}

		return kubernetes.NewForConfig(config)
	}

	return nil, fmt.Errorf("unknown provider \"%v\"", providerName)
}
