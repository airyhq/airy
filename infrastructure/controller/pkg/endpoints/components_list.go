package endpoints

import (
	"fmt"
	"net/http"

	helmCli "github.com/mittwald/go-helm-client"
	"k8s.io/client-go/kubernetes"
	"k8s.io/helm/cmd/helm/search"
	"k8s.io/klog"
)

type ComponentsList struct {
	Cli       helmCli.Client
	ClientSet *kubernetes.Clientset
	Namespace string
	Index     *search.Index
}

func (s *ComponentsList) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	deployedReleases, err := s.Cli.ListDeployedReleases()
	if err != nil {
		klog.Error(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	fmt.Fprintf(w, "%#v", deployedReleases)
	fmt.Fprintf(w, "%#v", s.Index.All())
	w.WriteHeader(http.StatusOK)
}
