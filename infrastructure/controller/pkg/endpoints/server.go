package endpoints

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"k8s.io/klog"

	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
)

func Serve(clientSet *kubernetes.Clientset, namespace string, kubeConfig *rest.Config, repoFilePath string) {
	r := mux.NewRouter()

	if allowedOrigins := os.Getenv("allowedOrigins"); allowedOrigins != "" {
		klog.Info("adding cors")
		middleware := NewCORSMiddleware(allowedOrigins)
		r.Use(middleware.Middleware)
	}

	// Load authentication middleware only if auth env is present
	authEnabled := false
	systemToken := os.Getenv("systemToken")
	jwtSecret := os.Getenv("jwtSecret")
	if systemToken != "" && jwtSecret != "" {
		klog.Info("adding system token auth")
		r.Use(NewSystemTokenMiddleware(systemToken).Middleware)

		klog.Info("adding jwt auth")
		r.Use(NewJwtMiddleware(jwtSecret).Middleware)
		authEnabled = true
	}

	if authEnabled {
		authMiddleware := MustNewAuthMiddleware("/components|/cluster")
		r.Use(authMiddleware.Middleware)
	}

	services := &Services{clientSet: clientSet, namespace: namespace}
	r.Handle("/services", services)

	componentsUpdate := &ComponentsUpdate{clientSet: clientSet, namespace: namespace}
	r.Handle("/components.update", componentsUpdate)

	componentsDelete := &ComponentsDelete{clientSet: clientSet, namespace: namespace}
	r.Handle("/components.delete", componentsDelete)

	clusterGet := &ClusterGet{clientSet: clientSet, namespace: namespace}
	r.Handle("/components.get", clusterGet)

	clusterUpdate := &ClusterUpdate{clientSet: clientSet, namespace: namespace}
	r.Handle("/cluster.update", clusterUpdate)

	componentsInstallUninstall := MustNewComponentsInstallUninstall(namespace, kubeConfig, clientSet, repoFilePath)
	r.Handle("/components.install", &componentsInstallUninstall)
	r.Handle("/components.uninstall", &componentsInstallUninstall)

	log.Fatal(http.ListenAndServe(":8080", r))
}
