/*
Acknowledgement to the following projects, as they were used
as a reference when creating the Airy Kubernetes Controller
- https://github.com/stakater/Reloader
- https://github.com/kubernetes/sample-controller

*/

package main

import (
	"flag"
	"os"

	cm "github.com/airyhq/airy/infrastructure/controller/pkg/configmap-controller"
	endpoints "github.com/airyhq/airy/infrastructure/controller/pkg/endpoints"
	v1 "k8s.io/api/core/v1"

	"k8s.io/klog"

	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"
)

func main() {
	var kubeConfig string
	var master string

	// Check if kubernetes configuration is provided, otherwise use serviceAccount
	flag.StringVar(&kubeConfig, "kubeconfig", "", "absolute path to the kubeConfig file")
	flag.StringVar(&master, "master", "", "master url")
	flag.Parse()

	// Create connection
	config, err := clientcmd.BuildConfigFromFlags(master, kubeConfig)
	if err != nil {
		klog.Fatal(err)
	}

	clientSet, err := kubernetes.NewForConfig(config)
	if err != nil {
		klog.Fatal(err)
	}

	namespace, present := os.LookupEnv("NAMESPACE")
	if present != true {
		klog.Infof("Namespace not set. Defaulting to: %s", v1.NamespaceDefault)
		namespace = v1.NamespaceDefault
	}

	labelSelector := os.Getenv("LABEL_SELECTOR")

	// Create configMap controller
	configMapController := cm.ConfigMapController(cm.Context{
		ClientSet:     clientSet,
		Namespace:     namespace,
		LabelSelector: labelSelector,
	})
	stop := make(chan struct{})
	defer close(stop)
	go configMapController.Run(1, stop)

	go endpoints.Serve(clientSet, namespace, config)

	// Wait forever
	select {}
}
