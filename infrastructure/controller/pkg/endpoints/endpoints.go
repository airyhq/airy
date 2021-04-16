package endpoints

import (
	"context"
	"encoding/json"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"log"
	"net/http"
)

type Server struct {
	clientSet *kubernetes.Clientset
}

type ComponentsResponse struct {
	Components []string `json:"components"`
}

func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	deployments, _ := s.clientSet.AppsV1().Deployments("default").List(context.TODO(), v1.ListOptions{
		LabelSelector: "core.airy.co/component",
	})

	componentsMap := make(map[string]int)
	for _, deployment := range deployments.Items {
		component := deployment.ObjectMeta.Labels["core.airy.co/component"]
		componentsMap[component] = 1
	}

	components := make([]string, 0, len(componentsMap))
	for component := range componentsMap {
		components = append(components, component)
	}

	resp, _ := json.Marshal(&ComponentsResponse{Components: components})
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(resp)
}

func Serve(clientSet *kubernetes.Clientset) {
	s := &Server{clientSet: clientSet}
	http.Handle("/components", s)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
