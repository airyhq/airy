package providers

import (
	"cli/pkg/console"
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
	CheckEnvironment() (bool, string)
	PostInstallation(providerConfig map[string]string, namespace string, dir workspace.ConfigDir) error
}

func MustGet(providerName ProviderName, w io.Writer, analytics *console.AiryAnalytics) Provider {
	if providerName == Minikube {
		return minikube.New(w, analytics)
	}

	if providerName == Aws {
		return aws.New(w, analytics)
	}

	panic(fmt.Sprintf("unknown provider \"%v\"", providerName))
}
