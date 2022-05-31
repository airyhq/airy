package cmcontroller

import (
	"context"

	"github.com/airyhq/airy/infrastructure/lib/go/k8s/handler"
	"github.com/airyhq/airy/infrastructure/lib/go/k8s/util"
	v1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/klog"
)

type ResourceCreatedHandler struct {
	ConfigMap *v1.ConfigMap
}

func (r ResourceCreatedHandler) Handle(ctx Context) error {
	klog.Infof("Added configMap: %s , sha: %s", r.ConfigMap.GetName(), util.GetSHAfromConfigmap(r.ConfigMap))
	deployments, errGetDeployments := handler.GetDeploymentsReferencingCm(ctx.ClientSet,
		r.ConfigMap.Name, ctx.Namespace, ctx.LabelSelector)
	if errGetDeployments != nil {
		klog.Errorf("Error retrieving affected deployments %v", errGetDeployments)
		return errGetDeployments
	}

	cnfMap, err := getConfigMapsByLabelKey(ctx.ClientSet, ctx.Namespace)
	if err != nil {
		klog.Errorf("Error retrieving configmap %s", err)
		return err
	}

	for _, deployment := range deployments {
		cnf := cnfMap[deployment.Labels["core.airy.co/component"]]
		if cnf != nil && cnf.ObjectMeta.Annotations != nil && cnf.ObjectMeta.Annotations["enabled"] == "false" {
			klog.Infof("Skipping deployment %s because it is disabled", deployment.Name)
			continue
		}

		//NOTE: this check is probably not needed anymore
		if !handler.CanBeStarted(deployment, ctx.ClientSet) {
			klog.Infof("Skipping deployment %s because it is missing config maps", deployment.Name)
			continue
		}

		klog.Infof("Scheduling start for deployment: %s", deployment.Name)
		if err := handler.ScaleDeployment(handler.ScaleCommand{
			ClientSet:       ctx.ClientSet,
			Namespace:       ctx.Namespace,
			DeploymentName:  deployment.Name,
			DesiredReplicas: 1, //TODO extract from annotation
		}); err != nil {
			klog.Errorf("Starting deployment failed: %v", err)
			return err
		}
		klog.Infof("Started deployment: %s", deployment.Name)
	}
	return nil
}

func getConfigMapsByLabelKey(clientSet kubernetes.Interface, namespace string) (map[string]*v1.ConfigMap, error) {
	configmaps, err := clientSet.CoreV1().ConfigMaps(namespace).List(
		context.Background(),
		metav1.ListOptions{LabelSelector: "core.airy.co/component"},
	)
	if err != nil {
		return nil, err
	}

	configMapMap := make(map[string]*v1.ConfigMap)
	for _, configmap := range configmaps.Items {
		cnf := configmap
		configMapMap[configmap.Labels["core.airy.co/component"]] = &cnf
	}

	return configMapMap, nil
}
