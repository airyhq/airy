package providers

import (
	"cli/pkg/console"
	"cli/pkg/providers/aws"
	"cli/pkg/providers/gcp"
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
	Gcp      ProviderName = "gcp"
)

type Provider interface {
	Provision(providerConfig map[string]string, dir workspace.ConfigDir) error
	GetOverrides() template.Variables
	CheckEnvironment() error
	PreInstallation(workspace string) (string, error)
}

func MustGet(providerName ProviderName, w io.Writer, analytics *console.AiryAnalytics) Provider {
	if providerName == Minikube {
		return minikube.New(w, analytics)
	}

	if providerName == Aws {
		return aws.New(w, analytics)
	}

	if providerName == Gcp {
		return gcp.New(w, analytics)
	}
	panic(fmt.Sprintf("unknown provider \"%v\"", providerName))
}
