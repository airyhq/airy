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

type StreamsCreate struct {
	KSqlHost  string
	KSqlPort  string
	AuthToken string
}

const joinSigns = "ab"

func (s *StreamsCreate) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	c := httpclient.NewClient(s.KSqlHost, s.AuthToken)
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
	var expr payloads.StreamsCreatePayload
	err = json.Unmarshal(body, &expr)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// if len(expr.Topics != 2) {
	// 	klog.Error("Only two topics supported. Current count: ", len(expr.topics))
	// 	w.WriteHeader(http.StatusInternalServerError)
	// 	return
	// }

	// var fields, t string

	// for i, topic := range expr.Topics {
	// 	t = fmt.Printf(joinSigns[i:1])
	// 	for _, field := range topic.Fields {
	// 		fields = append(fields, fmt.Sprintf(t, ".", field))
	// 	}
	// }

	ksql := fmt.Sprintf(
		"CREATE STREAM %s AS SELECT a.source, a.senderId, b.connectionState FROM messages a JOIN channels b WITHIN 365 DAYS ON b.source = a.source EMIT CHANGES;",
		expr.Name,
	)
	res, err := c.CreateStreams(ksql)

	if err != nil {
		klog.Error(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	response, err := json.Marshal(res)
	if err != nil {
		klog.Error(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(response)
}
