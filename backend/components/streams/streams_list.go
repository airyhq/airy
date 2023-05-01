package main

import (
	"encoding/json"
	"net/http"

	"github.com/airyhq/airy/lib/go/httpclient"

	"k8s.io/klog"
)

type StreamsList struct {
	KSqlHost  string
	KSqlPort  string
	AuthToken string
}

type Stream struct {
	Name  string `json:"name"`
	Topic string `json:"topic"`
}

func (s *StreamsList) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	c := httpclient.NewClient(s.KSqlHost, s.AuthToken)
	res, err := c.ListStreams()

	if err != nil {
		klog.Error(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	var streams []Stream

	for _, l := range *res {
		for _, stream := range l.Streams {
			streams = append(streams, Stream{stream.Name, stream.Topic})
		}
	}

	response, err := json.Marshal(streams)
	if err != nil {
		klog.Error(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(response)
}
