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

type ComponentsInstall struct {
	cli       helmCli.Client
	namespace string
}

func MustNewComponentsInstall(namespace string, kubeConfig *rest.Config) ComponentsInstall {
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

	return ComponentsInstall{namespace: namespace, cli: cli}
}

func (s *ComponentsInstall) ServeHTTP(w http.ResponseWriter, r *http.Request) {
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

	release, err := s.cli.InstallOrUpgradeChart(
		r.Context(),
		&helmCli.ChartSpec{
			ReleaseName: releaseName,
			ChartName:   chartName,
			Namespace:   s.namespace,
			UpgradeCRDs: true,
			Atomic:      true,
			Replace:     true,
		},
		nil,
	)
	if err != nil {
		klog.Error("Component not found: ", err.Error())
		w.WriteHeader(http.StatusNotFound)
		return
	}

	klog.Info(fmt.Sprintf("%#v", release))

	w.WriteHeader(http.StatusOK)
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
