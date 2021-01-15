package cmcontroller

import (
	"github.com/airyhq/airy/infrastructure/lib/go/k8s/handler"
	"github.com/airyhq/airy/infrastructure/lib/go/k8s/util"
	v1 "k8s.io/api/core/v1"
	"k8s.io/klog"
)

type ResourceCreatedHandler struct {
	ConfigMap   *v1.ConfigMap
}

func (r ResourceCreatedHandler) Handle(ctx Context) error {
	klog.Infof("Added configMap: %s , sha: %s", r.ConfigMap.GetName(), util.GetSHAfromConfigmap(r.ConfigMap))
	deployments, errGetDeployments := handler.GetDeploymentsReferencingCm(ctx.ClientSet,
		r.ConfigMap.Name, ctx.Namespace, ctx.LabelSelector)
	if errGetDeployments != nil {
		klog.Errorf("Error retrieving affected deployments %v", errGetDeployments)
		return errGetDeployments
	}

	for _, deployment := range deployments {
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
