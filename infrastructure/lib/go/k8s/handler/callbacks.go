package handler

import (
	"github.com/airyhq/airy/infrastructure/lib/go/k8s/util"

	apps_v1 "k8s.io/api/apps/v1"
	v1 "k8s.io/api/core/v1"
	meta_v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/klog"
)

//ItemsFunc is a generic function to return a specific resource array in given namespace
type ItemsFunc func(kubernetes.Interface, string, string) []interface{}

//ContainersFunc is a generic func to return containers
type ContainersFunc func(interface{}) []v1.Container

//InitContainersFunc is a generic func to return containers
type InitContainersFunc func(interface{}) []v1.Container

//VolumesFunc is a generic func to return volumes
type VolumesFunc func(interface{}) []v1.Volume

//UpdateFunc performs the resource update
type UpdateFunc func(kubernetes.Interface, string, string, interface{}) error

//AnnotationsFunc is a generic func to return annotations
type AnnotationsFunc func(interface{}) map[string]string

//PodAnnotationsFunc is a generic func to return annotations
type PodAnnotationsFunc func(interface{}) map[string]string

// GetDeploymentItems returns the deployments in given namespace
func GetDeploymentItems(clientset kubernetes.Interface, namespace string, labelSelector string) []interface{} {
	deployments, err := clientset.AppsV1().Deployments(namespace).List(nil, meta_v1.ListOptions{LabelSelector: labelSelector})
	if err != nil {
		klog.Errorf("Failed to list deployments %v", err)
	}
	return util.InterfaceSlice(deployments.Items)
}

// UpdateDeployment performs rolling upgrade on deployment
func UpdateDeployment(clientset kubernetes.Interface, namespace string, labelSelector string, resource interface{}) error {
	deployment := resource.(apps_v1.Deployment)
	_, err := clientset.AppsV1().Deployments(namespace).Update(nil, &deployment, meta_v1.UpdateOptions{})
	return err
}

// GetDeploymentAnnotations returns the annotations of given deployment
func GetDeploymentAnnotations(item interface{}) map[string]string {
	return item.(apps_v1.Deployment).ObjectMeta.Annotations
}

// GetDeploymentPodAnnotations returns the pod's annotations of given deployment
func GetDeploymentPodAnnotations(item interface{}) map[string]string {
	return item.(apps_v1.Deployment).Spec.Template.ObjectMeta.Annotations
}

// GetDeploymentContainers returns the containers of given deployment
func GetDeploymentContainers(item interface{}) []v1.Container {
	return item.(apps_v1.Deployment).Spec.Template.Spec.Containers
}

// GetDeploymentInitContainers returns the containers of given deployment
func GetDeploymentInitContainers(item interface{}) []v1.Container {
	return item.(apps_v1.Deployment).Spec.Template.Spec.InitContainers
}

// GetDeploymentVolumes returns the Volumes of given deployment
func GetDeploymentVolumes(item interface{}) []v1.Volume {
	return item.(apps_v1.Deployment).Spec.Template.Spec.Volumes
}
