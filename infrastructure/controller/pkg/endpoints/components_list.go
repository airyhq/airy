package endpoints

import (
	"encoding/json"
	"net/http"

	"github.com/airyhq/airy/infrastructure/controller/pkg/db"
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
	DB        *db.DB
}

func (s *ComponentsList) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	deployedCharts, err := s.getDeployedCharts()
	if err != nil {
		klog.Error(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	components, err := s.DB.GetComponentsData()
	if err != nil {
		klog.Error(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	seen := make(map[string]struct{})
	for _, chart := range s.Index.All() {
		if _, ok := seen[chart.Name]; ok {
			continue
		}
		seen[chart.Name] = struct{}{}

		if components[chart.Name] == nil {
			components[chart.Name] = make(map[string]interface{})
		}
		components[chart.Name]["installed"] = deployedCharts[chart.Chart.Name]
	}

	blob, err := json.Marshal(map[string]interface{}{"components": components})
	if err != nil {
		klog.Error(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(blob)
}

func (s *ComponentsList) getDeployedCharts() (map[string]bool, error) {
	deployedReleases, err := s.Cli.ListDeployedReleases()
	if err != nil {
		return nil, err
	}

	deployedCharts := make(map[string]bool, len(deployedReleases))
	for _, r := range deployedReleases {
		deployedCharts[r.Name] = true
	}

	return deployedCharts, nil
}
