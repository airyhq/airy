package endpoints

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"

	"k8s.io/client-go/kubernetes"
	"k8s.io/helm/cmd/helm/search"
)

type proxyTarget struct {
	name     string
	url      string
	stripUri string
}

type KafkaSubjects struct {
	ClientSet *kubernetes.Clientset
	Namespace string
	Index     *search.Index
}

type KafkaTopics struct {
	ClientSet *kubernetes.Clientset
	Namespace string
	Index     *search.Index
}

func (s *KafkaSubjects) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	var proxyUpstream = proxyTarget{"subjects", "http://schema-registry:8081/subjects", "/kafka/subjects"}
	proxyRequest(w, r, proxyUpstream)
}

func (s *KafkaTopics) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	var proxyUpstream = proxyTarget{"subjects", "http://schema-registry:8082/topics", "/kafka/topics"}
	proxyRequest(w, r, proxyUpstream)
}

func proxyRequest(w http.ResponseWriter, r *http.Request, proxyUpstream proxyTarget) {
	target, err := url.Parse(proxyUpstream.url)
	if err != nil {
		log.Printf("Error parsing target URL: %v\n", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	proxy := httputil.NewSingleHostReverseProxy(target)
	r.URL.Host = target.Host
	r.URL.Scheme = target.Scheme
	r.Header.Set("X-Forwarded-Host", r.Header.Get("Host"))
	r.Host = target.Host
	r.URL.Path = strings.TrimPrefix(r.URL.Path, proxyUpstream.stripUri)

	proxy.ServeHTTP(w, r)
}
