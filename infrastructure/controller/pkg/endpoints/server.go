package endpoints

import (
	"github.com/gorilla/mux"
	"k8s.io/klog"
	"log"
	"net/http"
	"os"

	"k8s.io/client-go/kubernetes"
)

func Serve(clientSet *kubernetes.Clientset, namespace string) {
	r := mux.NewRouter()

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
		authMiddleware := MustNewAuthMiddleware("/cluster")
		r.Use(authMiddleware.Middleware)
	}

	s := &Services{clientSet: clientSet, namespace: namespace}
	r.Handle("/services", s)

	log.Fatal(http.ListenAndServe(":8080", r))
}
