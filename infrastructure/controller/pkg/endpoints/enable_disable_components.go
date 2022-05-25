package endpoints

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

type EnableDisableComponents struct {
	clientSet *kubernetes.Clientset
	namespace string
}

type component struct {
	Name   string `json:"name"`
	Enable bool   `json:"enable,string"`
}

func (s *EnableDisableComponents) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	blob, err := ioutil.ReadAll(r.Body)
	//TODO: Write error messages and logs
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	var c component
	//TODO: Write error messages and logs
	if err := json.Unmarshal(blob, &c); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	deployments, err := s.clientSet.AppsV1().Deployments(s.namespace).List(
		r.Context(),
		v1.ListOptions{LabelSelector: fmt.Sprintf("core.airy.co/component=%s", c.Name)},
	)

	for _, deployment := range deployments.Items {
		//TODO: Write error messages and logs
		if c.Enable && *deployment.Spec.Replicas > 0 {
			w.WriteHeader(http.StatusOK)
			return
		}

		//TODO: Write error messages and logs
		if !c.Enable && *deployment.Spec.Replicas == 0 {
			w.WriteHeader(http.StatusOK)
			return
		}

		if c.Enable {
			//TODO: Allow variable number of replicas
			*deployment.Spec.Replicas = 1
		} else {
			*deployment.Spec.Replicas = 0
		}
		//TODO: Use Patch insdead
		_, err := s.clientSet.AppsV1().Deployments(s.namespace).Update(
			r.Context(),
			&deployment,
			v1.UpdateOptions{},
		)
		//TODO: Write error messages and logs
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
		}
	}

	//TODO: write the change to a config map
	w.WriteHeader(http.StatusAccepted)
}
