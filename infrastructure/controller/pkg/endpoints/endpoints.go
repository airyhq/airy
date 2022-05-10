package endpoints

import (
	"context"
	"encoding/json"
	"github.com/gorilla/mux"
	"k8s.io/klog"
	"log"
	"net/http"
	"os"

	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

type Server struct {
	clientSet *kubernetes.Clientset
	namespace string
}

type ServicesResponse struct {
	Services map[string]Service `json:"services"`
}

type Service struct {
	Enabled   bool   `json:"enabled"`
	Component string `json:"component"`
}

func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// Only return apps that are part of a component
	deployments, _ := s.clientSet.AppsV1().Deployments(s.namespace).List(context.TODO(), v1.ListOptions{
		LabelSelector: "core.airy.co/component",
	})

	componentsMap := make(map[string]Service)
	for _, deployment := range deployments.Items {
		app := deployment.ObjectMeta.Name
		componentsMap[app] = Service{
			Enabled:   *deployment.Spec.Replicas > 0,
			Component: deployment.ObjectMeta.Labels["core.airy.co/component"],
		}
	}

	resp, _ := json.Marshal(&ServicesResponse{Services: componentsMap})
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(resp)
}

func Serve(clientSet *kubernetes.Clientset, namespace string) {
	r := mux.NewRouter()

	// Load authentication middleware only if auth env is present
	authEnabled := false
	systemToken := os.Getenv("systemToken")
	if systemToken != "" {
		klog.Info("adding system token auth")
		authMiddleware := NewSystemTokenMiddleware(systemToken)
		r.Use(authMiddleware.Middleware)
	}

	jwtSecret := os.Getenv("jwtSecret")
	if jwtSecret != "" {
		klog.Info("adding jwt auth")
		authMiddleware := NewJwtMiddleware(jwtSecret)
		r.Use(authMiddleware.Middleware)
		authEnabled = true
	}

	if authEnabled {
		r.Use(EnableAuth)
	}

	s := &Server{clientSet: clientSet, namespace: namespace}
	r.Handle("/services", s)
	log.Fatal(http.ListenAndServe(":8080", r))
}
