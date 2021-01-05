package handler

import (
	"context"

	"github.com/airyhq/airy/infrastructure/lib/go/k8s/util"

	v1 "k8s.io/api/core/v1"
	meta_v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/util/retry"
	"k8s.io/klog"
)

func GetDeployments(clientset kubernetes.Interface, namespace string, labelSelector string) ([]string, error) {
	var deployments []string
	deploymentsClient := clientset.AppsV1().Deployments(namespace)
	retryErr := retry.RetryOnConflict(retry.DefaultRetry, func() error {
		result, getErr := deploymentsClient.List(context.TODO(), meta_v1.ListOptions{LabelSelector: labelSelector})
		if getErr != nil {
			klog.Errorf("Failed to get latest version of the Deployments: %v", getErr)
			return getErr
		}
		for _, deploymentItem := range (*result).Items {
			deployments = append(deployments, deploymentItem.Name)
		}
		return nil
	})
	return deployments, retryErr
}

func GetAffectedDeploymentsConfigmap(clientset kubernetes.Interface, configmapName string, namespace string, labelSelector string) ([]string, error) {
	deploymentsClient := clientset.AppsV1().Deployments(namespace)
	var affectedDeployments []string
	retryErr := retry.RetryOnConflict(retry.DefaultRetry, func() error {
		result, getErr := deploymentsClient.List(context.TODO(), meta_v1.ListOptions{LabelSelector: labelSelector})
		if getErr != nil {
			klog.Errorf("Failed to get latest version of the Deployments: %v", getErr)
			return getErr
		}
		for _, deploymentItem := range (*result).Items {
			var container *v1.Container
			containers := GetDeploymentContainers(deploymentItem)
			initContainers := GetDeploymentInitContainers(deploymentItem)

			// Check the containers which have an EnvReference
			container = getContainerWithEnvReference(containers, configmapName, "CONFIGMAP")
			if container != nil {
				klog.Infof("Found affected container in deployment: %s", deploymentItem.Name)
				affectedDeployments = append(affectedDeployments, deploymentItem.Name)
			} else {
				container = getContainerWithEnvReference(initContainers, configmapName, "CONFIGMAP")
				if container != nil {
					klog.Infof("Found affected initContainer in deployment: %s", deploymentItem.Name)
					affectedDeployments = append(affectedDeployments, deploymentItem.Name)
				}
			}

			// Check the containers which have a VolumeMount
			volumes := GetDeploymentVolumes(deploymentItem)
			volumeMountName := getVolumeMountName(volumes, "CONFIGMAP", configmapName)
			if volumeMountName != "" {
				container = getContainerWithVolumeMount(containers, volumeMountName)
				if container == nil && len(initContainers) > 0 {
					container = getContainerWithVolumeMount(initContainers, volumeMountName)
					if container != nil {
						// if configmap/secret is being used in init container then return the first Pod container to save reloader env
						affectedDeployments = append(affectedDeployments, deploymentItem.Name)
					}
				} else if container != nil {
					affectedDeployments = append(affectedDeployments, deploymentItem.Name)
				}
			}
		}

		return nil
	})
	return affectedDeployments, retryErr
}

func ReloadDeployment(clientset kubernetes.Interface, namespace string, deploymentName string) error {
	deploymentsClient := clientset.AppsV1().Deployments(namespace)
	deployment, getErr := deploymentsClient.Get(context.TODO(), deploymentName, meta_v1.GetOptions{})
	currentReplicas := deployment.Spec.Replicas
	// If currentReplicas is 0 - don't do anything
	if *currentReplicas != 0 {
		retryErr := retry.RetryOnConflict(retry.DefaultRetry, func() error {
			deployment, getErr = deploymentsClient.Get(context.TODO(), deploymentName, meta_v1.GetOptions{})
			if getErr != nil {
				klog.Errorf("Failed to get latest version of Deployment: %v", getErr)
				return getErr
			}
			deployment.Spec.Replicas = util.Int32Ptr(0) // reduce replica count
			_, updateErr := deploymentsClient.Update(context.TODO(), deployment, meta_v1.UpdateOptions{})
			deployment.Spec.Replicas = currentReplicas // increase replica count
			_, updateErr = deploymentsClient.Update(context.TODO(), deployment, meta_v1.UpdateOptions{})
			return updateErr
		})
		if retryErr != nil {
			klog.Errorf("Update failed: %v", retryErr)
			return retryErr
		}
		klog.Infof("Reloaded deployment %s", deploymentName)
		return nil
	}
	return getErr
}
