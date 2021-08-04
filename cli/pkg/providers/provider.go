package providers

import (
	"cli/pkg/kube"
	"cli/pkg/providers/aws"
	"cli/pkg/providers/minikube"
	"cli/pkg/workspace"
	"cli/pkg/workspace/template"
	"fmt"
	"io"
)

type ProviderName string

const (
	Minikube ProviderName = "minikube"
	Aws      ProviderName = "aws"
)

type Provider interface {
	Provision(providerConfig map[string]string, dir workspace.ConfigDir) (kube.KubeCtx, error)
	GetOverrides() template.Variables
	PostInstallation(providerConfig map[string]string, dir workspace.ConfigDir) error
}

func MustGet(providerName ProviderName, w io.Writer) Provider {
	if providerName == Minikube {
		return minikube.New(w)
	}

	if providerName == Aws {
		return aws.New(w)
	}

	panic(fmt.Sprintf("unknown provider \"%v\"", providerName))
}
