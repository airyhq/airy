package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"

	"github.com/airyhq/airy/lib/go/httpclient"
	"github.com/airyhq/airy/lib/go/payloads"

	"k8s.io/klog"
)

type StreamsCreate struct {
	KSqlHost  string
	KSqlPort  string
	AuthToken string
}

var fieldTypes = map[string]string{
	"map":     "map",
	"boolean": "boolean",
	"long":    "bigint",
	"string":  "string",
}

func (s *StreamsCreate) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	c := httpclient.NewClient(s.KSqlHost, s.AuthToken)
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
	var expr payloads.StreamsCreateRequestPayload
	err = json.Unmarshal(body, &expr)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if len(expr.Topics) != 2 {
		klog.Error("Only two topics supported. Current count: ", len(expr.Topics))
		http.Error(w, "Only two topics supported.", http.StatusBadRequest)
		return
	}

	fields := make(map[string][]string)
	abv := make(map[int]string)
	abv[0] = "a"
	abv[1] = "b"

	for i, topic := range expr.Topics {
		for _, field := range topic.Fields {
			var fieldType string
			var fieldNewName string
			if field.NewName == "" {
				fieldNewName = field.Name
			} else {
				fieldNewName = field.NewName
			}
			fields["combined"] = append(fields["combined"], abv[i]+"."+field.Name+" as "+fieldNewName)
			if ft, ok := fieldTypes[field.Type]; ok {
				fieldType = ft
			} else {
				fieldType = "varchar"
			}
			fields[topic.Name] = append(fields[topic.Name], field.Name+" "+fieldType)
		}
		ksql := fmt.Sprintf(
			"create stream %s (%s) with (kafka_topic='%s', partitions=10, value_format='avro');",
			expr.Name+"_"+strings.Replace(topic.Name, ".", "_", -1),
			strings.Join(fields[topic.Name], ", "),
			topic.Name,
		)
		klog.Info("Creating stream query: ", ksql)
		_, err = c.RunKSQL(ksql)
		if err != nil {
			klog.Error(err.Error())
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	}

	ksql := fmt.Sprintf(
		"CREATE STREAM %s AS SELECT %s FROM %s a LEFT JOIN %s b WITHIN 365 DAYS ON b.%s = a.%s EMIT CHANGES;",
		expr.Name,
		strings.Join(fields["combined"], ", "),
		expr.Name+"_"+strings.Replace(expr.Topics[0].Name, ".", "_", -1),
		expr.Name+"_"+strings.Replace(expr.Topics[1].Name, ".", "_", -1),
		expr.Joins[0].Field2,
		expr.Joins[0].Field1,
	)
	fmt.Println(ksql)

	_, err = c.CreateStream(ksql)

	if err != nil {
		klog.Error(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	response, _ := json.Marshal(payloads.StreamsCreateResponsePayload{
		Name:        expr.Name,
		OutputTopic: expr.Name,
	})

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(response)
}
