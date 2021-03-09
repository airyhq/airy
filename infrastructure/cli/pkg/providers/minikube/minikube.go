package minikube

import (
	"cli/pkg/kube"
	"fmt"
	"k8s.io/client-go/util/homedir"
	"os/exec"
	"path/filepath"
)

const (
	minikube = "minikube"
	profile  = "airy-core"
)

type Minikube struct {
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
	return runMinikube("start", "--cpus=4", "--memory=7168")
}

func runMinikube(args ...string) error {
	defaultArgs := []string{"--profile="+profile}
	cmd := exec.Command("minikube", append(defaultArgs, args...)...)
	if out, err := cmd.CombinedOutput(); err != nil {
		return fmt.Errorf("running Minikube failed with err: %v\n%v", err, string(out))
	}
	return nil
}
