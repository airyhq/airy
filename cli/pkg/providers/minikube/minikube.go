package minikube

import (
	"cli/pkg/console"
	"cli/pkg/kube"
	"cli/pkg/workspace"
	"cli/pkg/workspace/template"
	"io"
	"os"
	"os/exec"
	"strings"

	"github.com/airyhq/airy/lib/go/tools"

	"github.com/hashicorp/go-getter"
	"gopkg.in/segmentio/analytics-go.v3"
)

const (
	minikube      = "minikube"
	profile       = "airy-core"
	dockerRuntime = " --container-runtime=containerd"
)

type provider struct {
	context   kube.KubeCtx
	w         io.Writer
	analytics console.AiryAnalytics
}

func New(w io.Writer, analytics *console.AiryAnalytics) *provider {
	return &provider{
		w:         w,
		analytics: *analytics,
	}
}

func (p *provider) GetOverrides() template.Variables {
	return template.Variables{
		NgrokEnabled: true,
		Host:         "localhost",
	}
}

func (p *provider) CheckEnvironment() error {
	return workspace.CheckBinaries([]string{"minikube", "terraform"})
}
func (p *provider) PreInstallation(workspacePath string) (string, error) {
	remoteUrl := "github.com/airyhq/airy/infrastructure/terraform/install"
	installDir := workspacePath + "/terraform"
	installFlags := strings.Join([]string{"PROVIDER=minikube", "WORKSPACE=" + workspacePath}, "\n")

	var gitGetter = &getter.Client{
		Src: remoteUrl,
		Dst: installDir,
		Dir: true,
	}
	if err := gitGetter.Get(); err != nil {
		return "", err
	}
	err := os.WriteFile(installDir+"/install.flags", []byte(installFlags), 0666)
	if err != nil {
		return "", err
	}
	return installDir, nil
}

func (p *provider) Provision(providerConfig map[string]string, dir workspace.ConfigDir) error {
	installPath := dir.GetPath(".")
	id := tools.RandString(8)
	p.analytics.Track(analytics.Identify{
		AnonymousId: id,
		Traits: analytics.NewTraits().
			Set("provider", "Minikube"),
	})
	cmd := exec.Command("/bin/bash", "install.sh")
	cmd.Dir = installPath
	cmd.Stdin = os.Stdin
	cmd.Stderr = p.w
	cmd.Stdout = p.w
	err := cmd.Run()

	if err != nil {
		console.Exit("Error with Terraform installation", err)
	}
	return nil
}

func (p *provider) PostInstallation(providerConfig map[string]string, namespace string, dir workspace.ConfigDir) error {
	return nil
}
