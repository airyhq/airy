package providers

import (
	"cli/pkg/core"
	"cli/pkg/providers/aws"
	"cli/pkg/providers/minikube"
	"fmt"
)

type ProviderName string

const (
	Minikube ProviderName = "minikube"
	Aws      ProviderName = "aws"
)

type Provider interface {
	Provision() (core.KubeCtx, error)
	GetHosts() (core.AvailableHosts, error)
	GetHelmOverrides() []string
	PostInstallation(namespace string) error
}

func MustGet(providerName ProviderName) Provider {
	if providerName == Minikube {
		return &minikube.Minikube{}
	}

	if providerName == Aws {
		return &aws.Aws{}
	}

	panic(fmt.Sprintf("unknown provider \"%v\"", providerName))
}
