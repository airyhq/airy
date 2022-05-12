package endpoints

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/airyhq/airy/lib/go/config"
	"github.com/airyhq/airy/lib/go/k8s"
	"github.com/airyhq/airy/lib/go/payloads"
	"k8s.io/client-go/kubernetes"
	"k8s.io/klog"
)

type ComponentsUpdate struct {
	clientSet *kubernetes.Clientset
	namespace string
}

func (s *ComponentsUpdate) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}

	var conf payloads.ComponentsUpdateRequestPayload
	namespace := os.Getenv("NAMESPACE")
	responseComponents := payloads.ComponentsUpdateResponsePayload{}

	err = json.Unmarshal(body, &conf)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	secData := config.GetSecurityData(conf.Security)
	if len(secData) != 0 {
		applyErr := k8s.ApplyConfigMap("security", namespace, secData, map[string]string{}, s.clientSet)
		if applyErr != nil {
			klog.Error("Unable to apply configuration for \"security\"\nError:\n" + err.Error())
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		} else {
			responseComponents = append(responseComponents, config.Component{
				Enabled: true,
				Name:    "security",
			})
		}
	}

	for _, component := range conf.Components {
		labels := map[string]string{
			"core.airy.co/component": component.Name,
		}
		applyErr := k8s.ApplyConfigMap(component.Name, namespace, component.Data, labels, s.clientSet)
		if applyErr != nil {
			klog.Error("Unable to apply configuration for component:" + component.Name + "\nError:\n" + err.Error())
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		} else {
			responseComponents = append(responseComponents, config.Component{
				Enabled: true,
				Name:    component.Name,
			})
		}
	}

	resp, _ := json.Marshal(responseComponents)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(resp)
}
