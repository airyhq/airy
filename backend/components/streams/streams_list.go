package main

import (
	"encoding/json"
	"net/http"

	"k8s.io/klog"
)

type StreamsList struct {
	KSqlHost string
	KSqlPort string
}

func (s *StreamsList) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	response, err := json.Marshal(map[string]interface{}{"streams": "none"})
	if err != nil {
		klog.Error(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(response)
}
