package endpoints

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"

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
	if err != nil {
		klog.Infof("not able to read request body %s", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	var c component
	if err := json.Unmarshal(blob, &c); err != nil {
		klog.Errorf("invalid payload %s", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	deployments, err := s.clientSet.AppsV1().Deployments(s.namespace).List(
		r.Context(),
		v1.ListOptions{LabelSelector: fmt.Sprintf("core.airy.co/component=%s", c.Name)},
	)

	for _, deployment := range deployments.Items {
		if c.Enable && *deployment.Spec.Replicas > 0 {
			w.WriteHeader(http.StatusOK)
			return
		}

		if !c.Enable && *deployment.Spec.Replicas == 0 {
			w.WriteHeader(http.StatusOK)
			return
		}

		if c.Enable {
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
		if err != nil {
			klog.Errorf("unable to update deployment %S", err)
			w.WriteHeader(http.StatusInternalServerError)
		}
	}

	configmaps, err := s.clientSet.CoreV1().ConfigMaps(s.namespace).List(
		r.Context(),
		v1.ListOptions{LabelSelector: fmt.Sprintf("core.airy.co/component=%s", c.Name)},
	)
	if err != nil {
		klog.Errorf("not able to get config-map for component %s, %s", c.Name, err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	if len(configmaps.Items) == 0 {
		klog.Errorf("no config-map with this component name %s", c.Name)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	if len(configmaps.Items) > 1 {
		klog.Warningf("invalid number of config-maps %d", len(configmaps.Items))
	}

	cnf := configmaps.Items[0]
	if cnf.Annotations == nil {
		cnf.Annotations = make(map[string]string)
	}

	cnf.Annotations["enabled"] = strconv.FormatBool(c.Enable)
	_, err = s.clientSet.CoreV1().ConfigMaps(s.namespace).Update(
		r.Context(),
		&cnf,
		v1.UpdateOptions{},
	)
	if err != nil {
		klog.Errorf("not able to update config-map for component %s, %s", c.Name, err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusAccepted)
}
