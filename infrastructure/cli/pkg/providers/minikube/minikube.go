package minikube

import (
	"cli/pkg/kube"
	"context"
	"fmt"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/util/homedir"
	"net/url"
	"os/exec"
	"path/filepath"
	"strings"
)

const (
	minikube = "minikube"
	profile  = "airy-core"
)

type Minikube struct {
	context kube.KubeCtx
	localEndpoint string
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

	ctx := kube.New(filepath.Join(homeDir, ".kube", "config"), profile)
	m.context = ctx
	return ctx, nil
}

// Updates the host configmap with the service url
func (m *Minikube) PostInstallation(namespace string) error {
	clientset, err := m.context.GetClientSet()
	if err != nil {
		return err
	}

	configMaps := clientset.CoreV1().ConfigMaps(namespace)

	configMap, err := configMaps.Get(context.TODO(), "hostnames", metav1.GetOptions{})
	if err != nil {
		return err
	}

	parsedUrl, err := url.Parse(m.localEndpoint)
	if err != nil {
		return err
	}

	configMap.Data["HOST"] = parsedUrl.Host
	_, err = configMaps.Update(context.TODO(), configMap, metav1.UpdateOptions{})

	return err
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
	m.localEndpoint = endpoint
	coreId, err := runWithOutput("kubectl", "--", "get", "cm", "core-config", "-o", "jsonpath='{.data.CORE_ID}'")
	ngrokEndpoint := fmt.Sprintf("https://%s.tunnel.airy.co", strings.Trim(coreId, "'"))

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
