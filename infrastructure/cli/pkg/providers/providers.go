package providers

import (
	"cli/pkg/k8s_cluster"
	"cli/pkg/providers/aws"
	"cli/pkg/providers/minikube"
	"fmt"
	"os"
)

type ProviderName string

const (
	Local    ProviderName = "local"
	Minikube ProviderName = "minikube"
	Aws      ProviderName = "aws"
)

type Provider interface {
	Provision() (k8s_cluster.Context, error)
}

func GetProvider(providerName ProviderName) (Provider, error) {
	if providerName == Minikube {
		return &minikube.Minikube{}, nil
	}

	if providerName == Aws {
		return &aws.Aws{}, nil
	}

	// TODO remove this provider in #1041
	if providerName == Local {
		return &LocalProvider{}, nil
	}

	return nil, fmt.Errorf("unknown provider \"%v\"", providerName)
}

// TODO remove this provider in #1041
type LocalProvider struct {
}

func (l *LocalProvider) Provision() (k8s_cluster.Context, error) {
	return k8s_cluster.New(os.Getenv("KUBE_CONFIG_PATH"), ""), nil
}
