package endpoints

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/klog"
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
		klog.Infof("not able to read request body %s", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	var c component
	//TODO: Write error messages and logs
	if err := json.Unmarshal(blob, &c); err != nil {
		klog.Fatalf("invalid payload %s", err)
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

	configmaps, err := s.clientSet.CoreV1().ConfigMaps(s.namespace).List(
		r.Context(),
		v1.ListOptions{LabelSelector: fmt.Sprintf("core.airy.co/component=%s", c.Name)},
	)
	if err != nil {
		klog.Fatalf("not able to get config-map for component %s, %s", c.Name, err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	if len(configmaps.Items) != 1 {
		klog.Warningf("invalid number of config-maps %d", len(configmaps.Items))
	}
	w.WriteHeader(http.StatusAccepted)
}
