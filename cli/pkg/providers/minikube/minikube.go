package minikube

import (
	"cli/pkg/console"
	"cli/pkg/kube"
	"cli/pkg/workspace"
	"cli/pkg/workspace/template"
	"context"
	"fmt"
	"io"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"

	"gopkg.in/segmentio/analytics-go.v3"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/util/homedir"
)

const (
	minikube  = "minikube"
	profile   = "airy-core"
	hostAlias = "airy.core"
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
		Host:         "airy.core",
	}
}

func (p *provider) Provision(providerConfig map[string]string, dir workspace.ConfigDir) (kube.KubeCtx, error) {
	if err := checkInstallation(); err != nil {
		return kube.KubeCtx{}, err
	}

	if err := p.startCluster(); err != nil {
		return kube.KubeCtx{}, err
	}

	homeDir := homedir.HomeDir()
	if homeDir == "" {
		return kube.KubeCtx{}, fmt.Errorf("could not find the kubeconfig")
	}

	ctx := kube.New(filepath.Join(homeDir, ".kube", "config"), profile)
	p.context = ctx
	return ctx, nil
}

func checkInstallation() error {
	_, err := exec.LookPath(minikube)
	return err
}

func (p *provider) startCluster() error {
	args := []string{"start", "--driver=virtualbox", "--cpus=4", "--memory=7168", "--extra-config=apiserver.service-node-port-range=1-65535", "--driver=virtualbox"}
	// Prevent minikube download progress bar from polluting the output
	_, err := runGetOutput(append(args, "--download-only")...)
	if err != nil {
		return fmt.Errorf("downloading minikube files err: %v", err)
	}
	return p.runPrintOutput(args...)
}

func (p *provider) runPrintOutput(args ...string) error {
	cmd := getCmd(args...)
	fmt.Fprintf(p.w, "$ %s %s", cmd.Path, strings.Join(cmd.Args, " "))
	fmt.Fprintln(p.w)
	fmt.Fprintln(p.w)
	cmd.Stdout = p.w
	cmd.Stderr = p.w
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

func (p *provider) PostInstallation(providerConfig map[string]string, namespace string, dir workspace.ConfigDir) error {
	clientset, err := p.context.GetClientSet()
	if err != nil {
		return err
	}

	configMaps := clientset.CoreV1().ConfigMaps(namespace)
	configMap, err := configMaps.Get(context.TODO(), "core-config", metav1.GetOptions{})
	if err != nil {
		return err
	}

	// Ensure that kubectl is downloaded so that the progressbar does not pollute the output
	runGetOutput("kubectl", "version")

	coreId, err := runGetOutput("kubectl", "--", "get", "cm", "core-config", "-o", "jsonpath='{.data.CORE_ID}'")
	if err != nil {
		return err
	}
	coreId = strings.Trim(coreId, "'")

	p.analytics.Track(analytics.Identify{
		UserId: coreId,
		Traits: analytics.NewTraits().
			Set("provider", "minikube").
			Set("numCpu", runtime.NumCPU()),
	},
	)

	ngrokEndpoint := fmt.Sprintf("https://%s.tunnel.airy.co", coreId)

	configMap.Data["NGROK"] = ngrokEndpoint
	if _, err = configMaps.Update(context.TODO(), configMap, metav1.UpdateOptions{}); err != nil {
		return err
	}

	return AddHostRecord()
}
