package endpoints

import (
	"encoding/json"
	"net/http"

	"github.com/airyhq/airy/infrastructure/controller/pkg/cache"
	"github.com/airyhq/airy/infrastructure/controller/pkg/db"
	"k8s.io/client-go/kubernetes"
	"k8s.io/helm/cmd/helm/search"
	"k8s.io/klog"
)

type ComponentsList struct {
	ClientSet      *kubernetes.Clientset
	Namespace      string
	Index          *search.Index
	DB             *db.DB
	DeployedCharts *cache.DeployedCharts
}

func (s *ComponentsList) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	deployedCharts := s.DeployedCharts.GetDeployedCharts()

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
