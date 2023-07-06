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

type StreamsInfo struct {
	KSqlHost  string
	KSqlPort  string
	AuthToken string
}

func (s *StreamsInfo) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	c := httpclient.NewClient(s.KSqlHost, s.AuthToken)
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
	var expr payloads.StreamsInfoRequestPayload
	err = json.Unmarshal(body, &expr)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	ksql := fmt.Sprintf(
		"DESCRIBE %s ;",
		expr.Name,
	)
	res, err := c.InfoStream(ksql)
	fmt.Println("RES:", *res)

	if err != nil {
		klog.Error(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	response, _ := json.Marshal(res)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(response)
}
