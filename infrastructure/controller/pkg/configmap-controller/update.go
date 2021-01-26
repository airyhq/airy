package cmcontroller

import (
	"github.com/airyhq/airy/infrastructure/lib/go/k8s/handler"
	"github.com/airyhq/airy/infrastructure/lib/go/k8s/util"
	v1 "k8s.io/api/core/v1"
	"k8s.io/klog"
)

type ResourceUpdatedHandler struct {
	ConfigMap    *v1.ConfigMap
	OldConfigMap *v1.ConfigMap
}

func (r ResourceUpdatedHandler) Handle(ctx Context) error {
	klog.Infof("Updated configMap %s from sha: %s to sha: %s",
		r.ConfigMap.GetName(), util.GetSHAfromConfigmap(r.OldConfigMap), util.GetSHAfromConfigmap(r.ConfigMap))
	deployments, errGetDeployments := handler.GetDeploymentsReferencingCm(ctx.ClientSet,
		r.ConfigMap.Name, ctx.Namespace, ctx.LabelSelector)
	if errGetDeployments != nil {
		klog.Errorf("Error retrieving affected deployments %v", errGetDeployments)
	}

	for _, deployment := range deployments {
		klog.Infof("Scheduling reload for deployment: %s", deployment.Name)
		if err := handler.ReloadDeployment(deployment, ctx.ClientSet); err != nil {
			klog.Errorf("Reloading deployment failed: %v", err)
			return err
		}
		klog.Infof("Reloaded deployment: %s", deployment.Name)
	}
	return nil
}
