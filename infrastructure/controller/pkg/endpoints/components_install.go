package endpoints

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/airyhq/airy/lib/go/payloads"
	helmCli "github.com/mittwald/go-helm-client"
	"helm.sh/helm/v3/pkg/repo"
	"k8s.io/client-go/kubernetes"
	"k8s.io/klog"
)

type ComponentsInstall struct {
	cli       helmCli.Client
	clientSet *kubernetes.Clientset
}

func MustNewComponentsInstall(clientSet *kubernetes.Clientset, namespace string, kubeConfig string) ComponentsInstall {
	cli, err := helmCli.NewClientFromKubeConf(&helmCli.KubeConfClientOptions{
		Options: &helmCli.Options{
			Namespace: namespace,
		},
		KubeContext: "",
		KubeConfig:  []byte(kubeConfig),
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

	return ComponentsInstall{clientSet: clientSet, cli: cli}
}

func (s *ComponentsInstall) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	var installComponent payloads.ComponentsInstallRequestPayload

	err = json.Unmarshal(body, &installComponent)
	if err != nil || installComponent.Name == "" {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	release, err := s.cli.ListDeployedReleases()
	if err != nil {
		klog.Error("Component not found: %s", err.Error())
		w.WriteHeader(http.StatusNotFound)
		return
	}

	klog.Info("%#v", release)

	w.WriteHeader(http.StatusOK)
}
