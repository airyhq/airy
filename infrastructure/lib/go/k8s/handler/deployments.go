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

func ReloadDeployment(clientSet kubernetes.Interface, namespace string, deploymentName string) error {
	deploymentsClient := clientSet.AppsV1().Deployments(namespace)
	deployment, err := deploymentsClient.Get(context.TODO(), deploymentName, meta_v1.GetOptions{})
	if err != nil {
		return err
	}

	currentReplicas := deployment.Spec.Replicas

	// If replica is scaled down, don't do anything
	if *currentReplicas == 0 {
		return nil
	}

	return retry.RetryOnConflict(retry.DefaultRetry, func() error {
		deployment, err = deploymentsClient.Get(context.TODO(), deploymentName, meta_v1.GetOptions{})
		if err != nil {
			klog.Errorf("Failed to get latest version of Deployment: %v", err)
			return err
		}
		deployment.Spec.Replicas = util.Int32Ptr(0) // reduce replica count
		_, updateErr := deploymentsClient.Update(context.TODO(), deployment, meta_v1.UpdateOptions{})
		deployment.Spec.Replicas = currentReplicas // increase replica count
		_, updateErr = deploymentsClient.Update(context.TODO(), deployment, meta_v1.UpdateOptions{})
		return updateErr
	})
}

type ScaleCommand struct {
	ClientSet kubernetes.Interface
	Namespace string
	DeploymentName string
	DesiredReplicas int32
}

func ScaleDeployment(command ScaleCommand) error {
	deploymentsClient := command.ClientSet.AppsV1().Deployments(command.Namespace)
	return retry.RetryOnConflict(retry.DefaultRetry, func() error {
		deployment, err := deploymentsClient.Get(context.TODO(), command.DeploymentName, meta_v1.GetOptions{})
		if err != nil {
			klog.Errorf("Failed to get latest version of Deployment: %v", err)
			return err
		}

		if *deployment.Spec.Replicas == command.DesiredReplicas {
			return nil
		}

		deployment.Spec.Replicas = util.Int32Ptr(command.DesiredReplicas)
		_, updateErr := deploymentsClient.Update(context.TODO(), deployment, meta_v1.UpdateOptions{})
		return updateErr
	})
}
