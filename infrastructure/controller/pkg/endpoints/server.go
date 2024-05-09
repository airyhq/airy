package endpoints

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	helmCli "github.com/mittwald/go-helm-client"
	"helm.sh/helm/v3/pkg/repo"
	"k8s.io/helm/cmd/helm/search"
	krepo "k8s.io/helm/pkg/repo"
	"k8s.io/klog"

	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
)

func Serve(clientSet *kubernetes.Clientset, namespace string, kubeConfig *rest.Config, repoFilePath string) {
	r := mux.NewRouter()

	if allowedOrigins := os.Getenv("allowedOrigins"); allowedOrigins != "" {
		klog.Info("adding cors")
		middleware := NewCORSMiddleware(allowedOrigins)
		r.Use(middleware.Middleware)
	}

	// Load authentication middleware only if auth env is present
	authEnabled := false
	systemToken := os.Getenv("systemToken")
	jwtSecret := os.Getenv("jwtSecret")
	if systemToken != "" && jwtSecret != "" {
		klog.Info("adding system token auth")
		r.Use(NewSystemTokenMiddleware(systemToken).Middleware)

		klog.Info("adding jwt auth")
		r.Use(NewJwtMiddleware(jwtSecret).Middleware)
		authEnabled = true
	}

	if authEnabled {
		authMiddleware := MustNewAuthMiddleware("/components|/cluster")
		r.Use(authMiddleware.Middleware)
	}

	helmCli, helmIndex := mustGetHelmClientAndIndex(namespace, kubeConfig, clientSet, repoFilePath)

	services := &Services{clientSet: clientSet, namespace: namespace}
	r.Handle("/services", services)

	componentsUpdate := &ComponentsUpdate{clientSet: clientSet, namespace: namespace}
	r.Handle("/components.update", componentsUpdate)

	componentsDelete := &ComponentsDelete{clientSet: clientSet, namespace: namespace}
	r.Handle("/components.delete", componentsDelete)

	clusterGet := &ClusterGet{clientSet: clientSet, namespace: namespace}
	r.Handle("/components.get", clusterGet)

	clusterUpdate := &ClusterUpdate{clientSet: clientSet, namespace: namespace}
	r.Handle("/cluster.update", clusterUpdate)

	componentsInstallUninstall := ComponentsInstallUninstall{Cli: helmCli, ClientSet: clientSet, Namespace: namespace}
	r.Handle("/components.install", &componentsInstallUninstall)
	r.Handle("/components.uninstall", &componentsInstallUninstall)

	componentsList := ComponentsList{ClientSet: clientSet, Namespace: namespace, Index: helmIndex}
	r.Handle("/components.list", &componentsList)

	kafkaSubjects := KafkaSubjects{ClientSet: clientSet, Namespace: namespace, Index: helmIndex}
	r.Handle("/kafka/subjects", &kafkaSubjects)

	kafkaTopics := KafkaTopics{ClientSet: clientSet, Namespace: namespace, Index: helmIndex}
	r.Handle("/kafka/topics", &kafkaTopics)

	log.Fatal(http.ListenAndServe(":8080", r))
}

func mustGetHelmClientAndIndex(
	namespace string,
	kubeConfig *rest.Config,
	clientSet *kubernetes.Clientset,
	reposFilePath string,
) (helmCli.Client, *search.Index) {
	cli, err := helmCli.NewClientFromRestConf(&helmCli.RestConfClientOptions{
		Options: &helmCli.Options{
			Namespace: namespace,
		},
		RestConfig: kubeConfig,
	})
	if err != nil {
		log.Fatal(err)
	}

	repos, err := getReposFromFile(reposFilePath)
	if err != nil {
		log.Fatal(err)
	}

	index := search.NewIndex()

	for _, r := range repos {
		if r.Password != "" {
			r.PassCredentialsAll = true
		}

		if err := cli.AddOrUpdateChartRepo(r); err != nil {
			log.Fatal(err)
		}

		indexFile, err := krepo.LoadIndexFile(fmt.Sprintf("/tmp/.helmcache/%s-index.yaml", r.Name))
		if err != nil {
			log.Fatal(err)
		}

		index.AddRepo(r.Name, indexFile, true)
		klog.Info("Added ", r.Name, " repo")
	}

	return cli, index
}

func getReposFromFile(filePath string) ([]repo.Entry, error) {
	blob, err := ioutil.ReadFile(filePath)
	if err != nil {
		return nil, err
	}

	repos := struct {
		Repositories []repo.Entry `json:"repositories"`
	}{}

	if err := json.Unmarshal(blob, &repos); err != nil {
		return nil, err
	}

	return repos.Repositories, nil
}
