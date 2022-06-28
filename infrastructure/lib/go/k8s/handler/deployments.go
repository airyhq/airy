package handler

import (
	"context"

	apps_v1 "k8s.io/api/apps/v1"

	"github.com/airyhq/airy/infrastructure/lib/go/k8s/util"

	v1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/util/retry"
	"k8s.io/klog"
)

func GetDeploymentsReferencingCm(clientSet kubernetes.Interface, configMapName string, namespace string, labelSelector string) ([]apps_v1.Deployment, error) {
	deploymentsClient := clientSet.AppsV1().Deployments(namespace)
	var deployments []apps_v1.Deployment
	retryErr := retry.RetryOnConflict(retry.DefaultRetry, func() error {
		result, getErr := deploymentsClient.List(context.TODO(), metav1.ListOptions{LabelSelector: labelSelector})
		if getErr != nil {
			klog.Errorf("Failed to get latest version of the Deployments: %v", getErr)
			return getErr
		}
		for _, deploymentItem := range (*result).Items {
			var container *v1.Container
			containers := GetDeploymentContainers(deploymentItem)
			initContainers := GetDeploymentInitContainers(deploymentItem)

			// Check the containers which have an EnvReference
			container = getContainerWithEnvReference(containers, configMapName, ConfigmapEnvVarPostfix)
			if container != nil {
				klog.Infof("Found affected container in deployment: %s", deploymentItem.Name)
				deployments = append(deployments, deploymentItem)
			} else {
				container = getContainerWithEnvReference(initContainers, configMapName, ConfigmapEnvVarPostfix)
				if container != nil {
					klog.Infof("Found affected initContainer in deployment: %s", deploymentItem.Name)
					deployments = append(deployments, deploymentItem)
				}
			}

			// Check the containers which have a VolumeMount
			volumes := GetDeploymentVolumes(deploymentItem)
			volumeMountName := getVolumeMountName(volumes, ConfigmapEnvVarPostfix, configMapName)
			if volumeMountName != "" {
				container = getContainerWithVolumeMount(containers, volumeMountName)
				if container == nil && len(initContainers) > 0 {
					container = getContainerWithVolumeMount(initContainers, volumeMountName)
					if container != nil {
						// if configmap/secret is being used in init container then return the first Pod container to save reloader env
						deployments = append(deployments, deploymentItem)
					}
				} else if container != nil {
					deployments = append(deployments, deploymentItem)
				}
			}
		}

		return nil
	})
	return deployments, retryErr
}

// Won't do anything for replicas that are scaled down
func ReloadDeployment(deployment apps_v1.Deployment, clientSet kubernetes.Interface) error {
	deploymentsClient := clientSet.AppsV1().Deployments(deployment.Namespace)

	currentReplicas := deployment.Spec.Replicas
	return retry.RetryOnConflict(retry.DefaultRetry, func() error {
		deployment, err := deploymentsClient.Get(context.TODO(), deployment.Name, metav1.GetOptions{})
		if err != nil {
			klog.Errorf("Failed to get latest version of Deployment: %v", err)
			return err
		}
		deployment.Spec.Replicas = util.Int32Ptr(0) // reduce replica count
		_, updateErr := deploymentsClient.Update(context.TODO(), deployment, metav1.UpdateOptions{})
		if *currentReplicas == 0 {
			return updateErr
		}
		deployment.Spec.Replicas = currentReplicas // increase replica count
		_, updateErr = deploymentsClient.Update(context.TODO(), deployment, metav1.UpdateOptions{})
		return updateErr
	})
}

type ScaleCommand struct {
	ClientSet       kubernetes.Interface
	Namespace       string
	DeploymentName  string
	DesiredReplicas int32
}

func ScaleDeployment(command ScaleCommand) error {
	deploymentsClient := command.ClientSet.AppsV1().Deployments(command.Namespace)
	return retry.RetryOnConflict(retry.DefaultRetry, func() error {
		deployment, err := deploymentsClient.Get(context.TODO(), command.DeploymentName, metav1.GetOptions{})
		if err != nil {
			klog.Errorf("failed to get latest version of Deployment: %v", err)
			return err
		}

		if *deployment.Spec.Replicas == command.DesiredReplicas {
			return nil
		}

		deployment.Spec.Replicas = util.Int32Ptr(command.DesiredReplicas)
		_, updateErr := deploymentsClient.Update(context.TODO(), deployment, metav1.UpdateOptions{})
		return updateErr
	})
}

func CanBeStarted(deployment apps_v1.Deployment, clientSet kubernetes.Interface) bool {
	containers := GetDeploymentContainers(deployment)

	// Check that all referenced configMaps are present
	checkedConfigMaps := make(map[string]bool)
	for _, container := range containers {
		configMaps := GetReferencedConfigMaps(container)

		for _, configMapName := range configMaps {
			if !checkedConfigMaps[configMapName] {
				if !ConfigMapExists(configMapName, clientSet, deployment.Namespace) {
					return false
				}
				checkedConfigMaps[configMapName] = true
			}
		}
	}

	return true
}
