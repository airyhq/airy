package endpoints

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"

	"github.com/airyhq/airy/infrastructure/controller/pkg/cache"
	"github.com/airyhq/airy/lib/go/payloads"
	helmCli "github.com/mittwald/go-helm-client"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/klog"
)

type ComponentsInstallUninstall struct {
	Cli            helmCli.Client
	ClientSet      *kubernetes.Clientset
	Namespace      string
	DeployedCharts *cache.DeployedCharts
}

func (s *ComponentsInstallUninstall) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, `{"error": "not able to read body"}`)
		return
	}

	chartName, releaseName, err := getChartNameFromBlob(body)
	if err != nil {
		klog.Error(err.Error())
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, `{"error": "invalid component name"}`)
		return
	}

	globals, err := s.getGlobals(r.Context())
	if err != nil {
		klog.Error(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	chartSpec := &helmCli.ChartSpec{
		ReleaseName: releaseName,
		ChartName:   chartName,
		Namespace:   s.Namespace,
		UpgradeCRDs: true,
		Replace:     true,
		ValuesYaml:  globals,
	}

	if r.URL.Path == "/components.install" {
		_, err := s.Cli.InstallOrUpgradeChart(
			r.Context(),
			chartSpec,
			nil,
		)
		if err != nil {
			klog.Error("Component not found: ", err.Error())
			w.WriteHeader(http.StatusNotFound)
			return
		}
	} else if r.URL.Path == "/components.uninstall" {
		err := s.Cli.UninstallRelease(chartSpec)
		if err != nil {
			klog.Error("Component not installed: ", err.Error())
			w.WriteHeader(http.StatusNotFound)
			return
		}
	} else {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	s.DeployedCharts.RefreshDeployedCharts()
	w.WriteHeader(http.StatusAccepted)
}

func (s *ComponentsInstallUninstall) getGlobals(ctx context.Context) (string, error) {
	configMap, err := s.ClientSet.CoreV1().ConfigMaps(s.Namespace).Get(ctx, "core-config", metav1.GetOptions{})
	if err != nil {
		return "", err
	}

	var globals string
	if configMap.Data != nil {
		globals = configMap.Data["global.yaml"]
	}
	if globals == "" {
		return "", fmt.Errorf("globals not found")
	}

	return globals, nil
}

func getChartNameFromBlob(blob []byte) (string, string, error) {
	var installComponent payloads.ComponentsInstallRequestPayload

	if err := json.Unmarshal(blob, &installComponent); err != nil {
		return "", "", fmt.Errorf("Invalid chart name %s", err.Error())
	}

	s := strings.Split(installComponent.Name, "/")
	if len(s) != 2 {
		return "", "", fmt.Errorf("Invalid chart name %s", s)
	}

	return installComponent.Name, s[1], nil
}
