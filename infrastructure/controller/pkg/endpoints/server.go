package endpoints

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"k8s.io/klog"

	"k8s.io/client-go/kubernetes"
)

func Serve(clientSet *kubernetes.Clientset, namespace string, kubeConfig string) {
	r := mux.NewRouter()

	if allowedOrigins := os.Getenv("allowedOrigins"); allowedOrigins != "" {
		klog.Info("adding cors")
		middleware := NewCORSMiddleware(allowedOrigins)
		r.Use(middleware.Middleware)
	}

	// Load authentication middleware only if auth env is present
	authEnabled := false
	systemToken := os.Getenv("systemToken")
	if systemToken != "" {
		klog.Info("adding system token auth")
		middleware := NewSystemTokenMiddleware(systemToken)
		r.Use(middleware.Middleware)
	}

	jwtSecret := os.Getenv("jwtSecret")
	if jwtSecret != "" {
		klog.Info("adding jwt auth")
		middleware := NewJwtMiddleware(jwtSecret)
		r.Use(middleware.Middleware)
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

	componentsInstall := MustNewComponentsInstall(clientSet, namespace, kubeConfig)
	r.Handle("/cluster.install", &componentsInstall)

	log.Fatal(http.ListenAndServe(":8080", r))
}
