package endpoints

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"

	"github.com/airyhq/airy/lib/go/payloads"
	helmCli "github.com/mittwald/go-helm-client"
	"helm.sh/helm/v3/pkg/repo"
	"k8s.io/client-go/rest"
	"k8s.io/klog"
)

type ComponentsInstallUninstall struct {
	cli       helmCli.Client
	namespace string
}

func MustNewComponentsInstallUninstall(namespace string, kubeConfig *rest.Config) ComponentsInstallUninstall {
	cli, err := helmCli.NewClientFromRestConf(&helmCli.RestConfClientOptions{
		Options: &helmCli.Options{
			Namespace: namespace,
		},
		RestConfig: kubeConfig,
	})
	if err != nil {
		log.Fatal(err)
	}

	//NOTE: For now we are setting the repos here. But in the future we could get them for an external configuration
	chartRepoCore := repo.Entry{
		Name: "airy-core",
		URL:  "https://helm.airy.co",
	}
	if err := cli.AddOrUpdateChartRepo(chartRepoCore); err != nil {
		log.Fatal(err)
	}

	return ComponentsInstallUninstall{namespace: namespace, cli: cli}
}

func (s *ComponentsInstallUninstall) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	chartName, releaseName, err := getChartNameFromBlob(body)
	if err != nil {
		klog.Error(err.Error())
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	chartSpec := &helmCli.ChartSpec{
		ReleaseName: releaseName,
		ChartName:   chartName,
		Namespace:   s.namespace,
		UpgradeCRDs: true,
		Replace:     true,
	}

	if r.URL.Path == "/components.install" {
		_, err := s.cli.InstallOrUpgradeChart(
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
		err := s.cli.UninstallRelease(chartSpec)
		if err != nil {
			klog.Error("Component not installed: ", err.Error())
			w.WriteHeader(http.StatusNotFound)
			return
		}
	} else {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusAccepted)
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
