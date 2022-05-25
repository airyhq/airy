package endpoints

import (
	"encoding/json"
	"io/ioutil"
	"net/http"

	"github.com/airyhq/airy/lib/go/config"
	"github.com/airyhq/airy/lib/go/k8s"
	"github.com/airyhq/airy/lib/go/payloads"
	"k8s.io/client-go/kubernetes"
	"k8s.io/klog"
)

type ClusterUpdate struct {
	clientSet *kubernetes.Clientset
	namespace string
}

func (s *ClusterUpdate) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}

	var conf payloads.ClusterUpdateRequestPayload

	err = json.Unmarshal(body, &conf)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var response payloads.ClusterUpdateResponsePayload
	response.ClusterConfig = make(map[string]bool)

	secData := config.GetSecurityData(conf.Security)
	if len(secData) != 0 {
		applyErr := k8s.ApplyConfigMap("security", s.namespace, secData, map[string]string{}, s.clientSet)
		if applyErr != nil {
			klog.Error("Unable to apply configuration for \"security\"\nError:\n" + err.Error())
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		} else {
			response.ClusterConfig["security"] = true
		}
	}

	resp, _ := json.Marshal(response)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(resp)
}
