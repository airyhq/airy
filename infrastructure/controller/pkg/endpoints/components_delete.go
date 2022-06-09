package endpoints

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/airyhq/airy/lib/go/k8s"
	"github.com/airyhq/airy/lib/go/payloads"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/klog"
)

type ComponentsDelete struct {
	clientSet *kubernetes.Clientset
	namespace string
}

func (s *ComponentsDelete) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}

	var requestComponents payloads.ComponentsDeleteRequestPayload
	err = json.Unmarshal(body, &requestComponents)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	responseComponents := payloads.ComponentsDeleteResponsePayload{}
	responseComponents.Components = make(map[string]bool)

	configmapList, _ := s.clientSet.CoreV1().ConfigMaps(s.namespace).List(r.Context(), v1.ListOptions{LabelSelector: "core.airy.co/component"})
	configmapSet := make(map[string]string)
	for _, cm := range configmapList.Items {
		configmapSet[cm.ObjectMeta.Name] = cm.ObjectMeta.Name
	}

	for _, component := range requestComponents.Components {
		_, ok := configmapSet[component]
		if ok == true {
			deleteErr := k8s.DeleteConfigMap(component, s.namespace, s.clientSet)
			if deleteErr != nil {
				klog.Error("Unable to remove configuration for component:" + component + "\nError:\n" + err.Error())
				responseComponents.Components[component] = false
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			fmt.Println("Delete configmap %s", component)
			responseComponents.Components[component] = true
		}

	}

	resp, _ := json.Marshal(responseComponents)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(resp)
}
