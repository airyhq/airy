package endpoints

import (
	"encoding/json"
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

//NOTE: We don't know yet how or where some properties like AvailableFor/Categories/Price
//      are going to get stores, so for now they are defined but not used
type responesPayload struct {
	Name         string `json:"name"`
	Description  string `json:"description"`
	Installed    bool   `json:"installed"`
	AvailableFor string `json:"availableFor"`
	Categories   string `json:"categories"`
	Price        string `json:"price"`
}

func (s *ComponentsList) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	deployedCharts, err := s.getDeployedCharts()
	if err != nil {
		klog.Error(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	components := make([]*responesPayload, 0, len(deployedCharts))
	seen := make(map[string]struct{})
	for _, chart := range s.Index.All() {
		if _, ok := seen[chart.Name]; ok {
			continue
		}
		seen[chart.Name] = struct{}{}

		c := &responesPayload{
			Name:      chart.Name,
			Installed: deployedCharts[chart.Chart.Name],
		}

		components = append(components, c)
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
