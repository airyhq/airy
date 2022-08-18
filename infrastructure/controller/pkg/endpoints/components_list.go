package endpoints

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/airyhq/airy/infrastructure/controller/pkg/cache"
	"github.com/airyhq/airy/lib/go/k8s"
	"k8s.io/client-go/kubernetes"
	"k8s.io/helm/cmd/helm/search"
	"k8s.io/klog"
)

type ComponentsList struct {
	ClientSet      *kubernetes.Clientset
	Namespace      string
	Index          *search.Index
	DeployedCharts *cache.DeployedCharts
}

func (s *ComponentsList) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	deployedCharts, err := k8s.GetInstalledComponents(r.Context(), s.Namespace, s.ClientSet)

	components, err := getComponentsDetailsFromCloud()
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

type componentsData struct {
	Count        int                 `json:"Count"`
	Items        []map[string]string `json:"Items"`
	ScannedCount int                 `json:"ScannedCount"`
}

func getComponentsDetailsFromCloud() (map[string]map[string]interface{}, error) {
	//NOTE: This is a temporary solution before doing the refactoring
	resp, err := http.Get("https://93l1ztafga.execute-api.us-east-1.amazonaws.com")
	if err != nil {
		return nil, err
	}

	blob, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("%s", blob)
	}

	var data componentsData
	err = json.Unmarshal(blob, &data)
	if err != nil {
		return nil, err
	}

	componentsDetails := make(map[string]map[string]interface{})
	for _, item := range data.Items {
		name, ok := item["name"]
		if !ok || name == "" {
			continue
		}

		c := make(map[string]interface{})
		for k, v := range item {
			//NOTE: For now we are assuming that all the values are strings
			if v != "" {
				c[k] = v
			}
		}

		c["installed"] = false
		componentsDetails[name] = c
	}

	return componentsDetails, nil
}
