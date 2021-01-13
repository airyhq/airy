package configmapController

import (
	"github.com/airyhq/airy/infrastructure/lib/go/k8s/handler"
	"github.com/airyhq/airy/infrastructure/lib/go/k8s/util"
	v1 "k8s.io/api/core/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/klog"
)

// ResourceCreatedHandler contains new objects
type ResourceDeleteHandler struct {
	ConfigMap   *v1.ConfigMap
}

// Handle processes the newly created resource
func (r ResourceDeleteHandler) Handle(clientSet kubernetes.Interface) error {
	klog.Infof("Removed configMap: %s , sha: %s", r.ConfigMap.GetName(), util.GetSHAfromConfigmap(r.ConfigMap))
	affectedDeployments, errGetDeployments := handler.GetAffectedDeploymentsConfigmap(clientSet,
		r.ConfigMap.Name, "default", "")
	if errGetDeployments != nil {
		klog.Errorf("Error retrieving affected deployments %v", errGetDeployments)
		return errGetDeployments
	}

	for _, affectedDeployment := range affectedDeployments {
		klog.Infof("Scheduling stopping for deployment: %s", affectedDeployment)
		if err := handler.ScaleDeployment(handler.ScaleCommand{
			ClientSet: clientSet,
			Namespace: "default",
			DeploymentName: affectedDeployment,
			DesiredReplicas: 0,
		}); err != nil {
			klog.Errorf("Stopping deployment failed: %v", err)
			return err
		}
		klog.Infof("Stopped deployment: %s", affectedDeployment)
	}
	return nil
}
