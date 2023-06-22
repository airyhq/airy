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
		authMiddleware := MustNewAuthMiddleware("/streams")
		r.Use(authMiddleware.Middleware)
	}

	streamsList := StreamsList{KSqlHost: "ksqldb-server", KSqlPort: "80", AuthToken: ""}
	r.Handle("/streams.list", &streamsList)

	streamsCreate := StreamsCreate{KSqlHost: "ksqldb-server", KSqlPort: "80", AuthToken: ""}
	r.Handle("/streams.create", &streamsCreate)

	streamsDelete := StreamsDelete{KSqlHost: "ksqldb-server", KSqlPort: "80", AuthToken: ""}
	r.Handle("/streams.delete", &streamsDelete)

	streamsInfo := StreamsInfo{KSqlHost: "ksqldb-server", KSqlPort: "80", AuthToken: ""}
	r.Handle("/streams.info", &streamsInfo)

	log.Fatal(http.ListenAndServe(":8080", r))
}
