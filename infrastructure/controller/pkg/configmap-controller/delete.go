package cmcontroller

import (
	"github.com/airyhq/airy/infrastructure/lib/go/k8s/handler"
	"github.com/airyhq/airy/infrastructure/lib/go/k8s/util"
	v1 "k8s.io/api/core/v1"
	"k8s.io/klog"
)

type ResourceDeleteHandler struct {
	ConfigMap   *v1.ConfigMap
}

func (r ResourceDeleteHandler) Handle(ctx Context) error {
	klog.Infof("Deleted configMap: %s , sha: %s", r.ConfigMap.GetName(), util.GetSHAfromConfigmap(r.ConfigMap))
	deployments, errGetDeployments := handler.GetDeploymentsReferencingCm(ctx.ClientSet,
		r.ConfigMap.Name, ctx.Namespace, ctx.LabelSelector)
	if errGetDeployments != nil {
		klog.Errorf("Error retrieving affected deployments %v", errGetDeployments)
		return errGetDeployments
	}

	for _, deployment := range deployments {
		klog.Infof("Scheduling stopping for deployment: %s", deployment.Name)
		if err := handler.ScaleDeployment(handler.ScaleCommand{
			ClientSet:       ctx.ClientSet,
			Namespace:       ctx.Namespace,
			DeploymentName:  deployment.Name,
			DesiredReplicas: 0,
		}); err != nil {
			klog.Errorf("Stopping deployment failed: %v", err)
			return err
		}
		klog.Infof("Stopped deployment: %s", deployment.Name)
	}
	return nil
}
