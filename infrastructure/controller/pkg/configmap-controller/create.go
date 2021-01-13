package configmapController

import (
	"github.com/airyhq/airy/infrastructure/lib/go/k8s/handler"
	"github.com/airyhq/airy/infrastructure/lib/go/k8s/util"
	v1 "k8s.io/api/core/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/klog"
)

// ResourceCreatedHandler contains new objects
type ResourceCreatedHandler struct {
	ConfigMap   *v1.ConfigMap
}

// Handle processes the newly created resource
func (r ResourceCreatedHandler) Handle(clientSet kubernetes.Interface) error {
	klog.Infof("Added configMap: %s , sha: %s", r.ConfigMap.GetName(), util.GetSHAfromConfigmap(r.ConfigMap))
	affectedDeployments, errGetDeployments := handler.GetAffectedDeploymentsConfigmap(clientSet,
		r.ConfigMap.Name, "default", "")
	if errGetDeployments != nil {
		klog.Errorf("Error retrieving affected deployments %v", errGetDeployments)
		return errGetDeployments
	}

	for _, affectedDeployment := range affectedDeployments {
		klog.Infof("Scheduling start for deployment: %s", affectedDeployment)
		if err := handler.ScaleDeployment(handler.ScaleCommand{
			ClientSet: clientSet,
			Namespace: "default",
			DeploymentName: affectedDeployment,
			DesiredReplicas: 1,
		}); err != nil {
			klog.Errorf("Starting deployment failed: %v", err)
			return err
		}
		klog.Infof("Started deployment: %s", affectedDeployment)
	}
	return nil
}
