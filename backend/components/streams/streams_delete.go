package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/airyhq/airy/lib/go/httpclient"
	"github.com/airyhq/airy/lib/go/payloads"

	"k8s.io/klog"
)

type StreamsDelete struct {
	KSqlHost  string
	KSqlPort  string
	AuthToken string
}

func (s *StreamsDelete) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	c := httpclient.NewClient(s.KSqlHost, s.AuthToken)
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
	var expr payloads.StreamsDeleteRequestPayload
	err = json.Unmarshal(body, &expr)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	ksql := fmt.Sprintf(
		"DROP STREAM %s ;",
		expr.Name,
	)
	_, err = c.DeleteStream(ksql)

	if err != nil {
		klog.Error(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	response, _ := json.Marshal(payloads.StreamsDeleteResponsePayload{
		Name: expr.Name,
	})

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(response)
}
