package minikube

import (
	"cli/pkg/kube"
	"fmt"
	"k8s.io/client-go/util/homedir"
	"os/exec"
	"path/filepath"
	"strings"
)

const (
	minikube = "minikube"
	profile  = "airy-core"
)

type Minikube struct {
}

func (m *Minikube) GetHelmOverrides() []string {
	return []string{"--set", "global.enableNgrok=true"}
}

func (m *Minikube) Provision() (kube.KubeCtx, error) {
	if err := checkInstallation(); err != nil {
		return kube.KubeCtx{}, err
	}

	if err := startCluster(); err != nil {
		return kube.KubeCtx{}, err
	}

	homeDir := homedir.HomeDir()
	if homeDir == "" {
		return kube.KubeCtx{}, fmt.Errorf("could not find the kubeconfig")
	}

	return kube.New(filepath.Join(homeDir, ".kube", "config"), profile), nil
}

func checkInstallation() error {
	_, err := exec.LookPath(minikube)
	return err
}

func startCluster() error {
	return run("start", "--driver=virtualbox", "--cpus=4", "--memory=7168")
}

func (m *Minikube) GetHosts() (map[string]string, error) {
	endpoint, err := runWithOutput("--namespace=kube-system", "service", "--url", "traefik")
	if err != nil {
		return nil, err
	}
	coreId, err := runWithOutput("kubectl", "--", "get", "cm", "core-config", "-o", "jsonpath='{.data.CORE_ID}'")
	ngrokEndpoint := fmt.Sprintf("https://%s.tunnel.airy.co", strings.TrimSpace(coreId))

	return map[string]string{"Local": endpoint, "Ngrok": ngrokEndpoint}, err
}

func run(args ...string) error {
	_, err := runWithOutput(args...)
	return err
}

func runWithOutput(args ...string) (string, error) {
	defaultArgs := []string{"--profile=" + profile}
	cmd := exec.Command("minikube", append(defaultArgs, args...)...)
	out, err := cmd.CombinedOutput()
	if err != nil {
		return string(out), fmt.Errorf("running Minikube failed with err: %v\n%v", err, string(out))
	}
	return string(out), nil
}
