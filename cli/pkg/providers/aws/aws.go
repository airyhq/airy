package aws

import (
	"cli/pkg/console"
	"cli/pkg/kube"
	"cli/pkg/workspace"
	tmpl "cli/pkg/workspace/template"
	"io"
	"math/rand"
	"os"
	"os/exec"
	"strings"
	"time"

	getter "github.com/hashicorp/go-getter"
	"gopkg.in/segmentio/analytics-go.v3"
)

var letters = []rune("abcdefghijklmnopqrstuvwxyz")

type provider struct {
	w         io.Writer
	analytics console.AiryAnalytics
}

func New(w io.Writer, analytics *console.AiryAnalytics) *provider {
	return &provider{
		w:         w,
		analytics: *analytics,
	}
}

func (p *provider) GetOverrides() tmpl.Variables {
	return tmpl.Variables{
		LoadbalancerAnnotations: map[string]string{"service.beta.kubernetes.io/aws-load-balancer-type": "nlb"},
	}
}
func (p *provider) CheckEnvironment() error {
	return workspace.CheckBinaries([]string{"terraform", "aws"})
}
func (p *provider) PreInstallation(workspacePath string) (string, error) {
	remoteUrl := "github.com/airyhq/airy/infrastructure/terraform/install"
	installDir := workspacePath + "/terraform"
	installFlags := strings.Join([]string{"PROVIDER=aws-eks", "WORKSPACE=" + workspacePath}, "\n")

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

func (p *provider) PostInstallation(providerConfig map[string]string, namespace string, dir workspace.ConfigDir) error {
	return nil
}

type KubeConfig struct {
	ClusterName     string
	EndpointUrl     string
	CertificateData string
}

func (p *provider) Provision(providerConfig map[string]string, dir workspace.ConfigDir) (kube.KubeCtx, error) {
	installPath := dir.GetPath(".")
	id := RandString(8)
	p.analytics.Track(analytics.Identify{
		AnonymousId: id,
		Traits: analytics.NewTraits().
			Set("provider", "AWS"),
	})
	name := "Airy-" + id
	cmd := exec.Command("/bin/bash", "install.sh")
	cmd.Dir = installPath
	cmd.Stdin = os.Stdin
	cmd.Stderr = p.w
	cmd.Stdout = p.w
	err := cmd.Run()

	if err != nil {
		console.Exit("Error with Terraform installation", err)
	}
	ctx := kube.KubeCtx{
		KubeConfigPath: "./kube.conf", // change this into a CLI
		ContextName:    name,
	}
	return ctx, nil
}

func RandString(n int) string {
	rand.Seed(time.Now().UnixNano())
	b := make([]rune, n)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}
