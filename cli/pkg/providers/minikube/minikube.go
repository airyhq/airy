package minikube

import (
	"cli/pkg/kube"
	"cli/pkg/workspace"
	"context"
	"fmt"
	"io"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/util/homedir"
	"os/exec"
	"path/filepath"
	"strings"
)

const (
	minikube  = "minikube"
	profile   = "airy-core"
	hostAlias = "airy.core"
)

type provider struct {
	context kube.KubeCtx
	w       io.Writer
}

func New(w io.Writer) *provider {
	return &provider{
		w: w,
	}
}

func (m *provider) GetHelmOverrides() []string {
	return []string{"--set", "global.ngrokEnabled=true", "--set", "global.nodePort=80"}
}

func (m *provider) Provision(dir workspace.ConfigDir) (kube.KubeCtx, error) {
	if err := checkInstallation(); err != nil {
		return kube.KubeCtx{}, err
	}

	if err := m.startCluster(); err != nil {
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

func checkInstallation() error {
	_, err := exec.LookPath(minikube)
	return err
}

func (m *provider) startCluster() error {
	return m.runPrintOutput("start", "--driver=virtualbox", "--cpus=4", "--memory=7168", "--extra-config=apiserver.service-node-port-range=1-65535")
}

func (m *provider) runPrintOutput(args ...string) error {
	cmd := getCmd(args...)
	fmt.Fprintf(m.w, "$ %s %s", cmd.Path, strings.Join(cmd.Args, " "))
	fmt.Fprintln(m.w)
	fmt.Fprintln(m.w)
	cmd.Stdout = m.w
	cmd.Stderr = m.w
	return cmd.Run()
}

func runGetOutput(args ...string) (string, error) {
	cmd := getCmd(args...)
	out, err := cmd.CombinedOutput()
	if err != nil {
		return string(out), fmt.Errorf("running minikube failed with err: %v\n%v", err, string(out))
	}
	return string(out), nil
}

func getCmd(args ...string) *exec.Cmd {
	defaultArgs := []string{"--profile=" + profile}
	return exec.Command(minikube, append(defaultArgs, args...)...)
}

func (m *provider) PostInstallation(namespace string) error {
	clientset, err := m.context.GetClientSet()
	if err != nil {
		return err
	}

	configMaps := clientset.CoreV1().ConfigMaps(namespace)
	configMap, err := configMaps.Get(context.TODO(), "hostnames", metav1.GetOptions{})
	if err != nil {
		return err
	}

	// Ensure that kubectl is downloaded so that the progressbar does not pollute the output
	runGetOutput("kubectl", "version")

	coreId, err := runGetOutput("kubectl", "--", "get", "cm", "core-config", "-o", "jsonpath='{.data.CORE_ID}'")
	if err != nil {
		return err
	}
	ngrokEndpoint := fmt.Sprintf("https://%s.tunnel.airy.co", strings.Trim(coreId, "'"))

	configMap.Data["NGROK"] = ngrokEndpoint
	if _, err = configMaps.Update(context.TODO(), configMap, metav1.UpdateOptions{}); err != nil {
		return err
	}

	return AddHostRecord()
}
