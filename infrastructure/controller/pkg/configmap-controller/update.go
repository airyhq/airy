package configmapController

import (
	"github.com/airyhq/airy/infrastructure/lib/go/k8s/handler"
	"github.com/airyhq/airy/infrastructure/lib/go/k8s/util"
	v1 "k8s.io/api/core/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/klog"
)

// ResourceUpdatedHandler contains updated objects
type ResourceUpdatedHandler struct {
	ConfigMap    *v1.ConfigMap
	OldConfigMap *v1.ConfigMap
}

// Handle processes the updated resource
func (r ResourceUpdatedHandler) Handle(clientSet kubernetes.Interface) error {
	klog.Infof("Updated configMap %s from sha: %s to sha: %s",
		r.ConfigMap.GetName(), util.GetSHAfromConfigmap(r.OldConfigMap), util.GetSHAfromConfigmap(r.ConfigMap))
	affectedDeployments, errGetDeployments := handler.GetAffectedDeploymentsConfigmap(clientSet,
		r.ConfigMap.Name, "default", "")
	if errGetDeployments != nil {
		klog.Errorf("Error retrieving affected deployments %v", errGetDeployments)
	}

	for _, affectedDeployment := range affectedDeployments {
		klog.Infof("Scheduling reload for deployment: %s", affectedDeployment)
		if err := handler.ReloadDeployment(clientSet, "default", affectedDeployment); err != nil {
			klog.Errorf("Reloading deployment failed: %v", err)
			return err
		}
		klog.Infof("Reloaded deployment: %s", affectedDeployment)
	}
	return nil
}
