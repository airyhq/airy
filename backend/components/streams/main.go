package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"k8s.io/klog"
)

func main() {
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

	streamsList := StreamsList{KSqlHost: "ksqldb-server", KSqlPort: "80"}
	r.Handle("/streams.list", &streamsList)

	log.Fatal(http.ListenAndServe(":8080", r))
}
