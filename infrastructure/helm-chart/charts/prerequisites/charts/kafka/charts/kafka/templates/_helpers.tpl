{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "kafka.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "kafka.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- if contains $name .Release.Name -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s" $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "kafka.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Form the Advertised Listeners. We will use the value of nodeport.firstListenerPort to create the
external advertised listeners if configurationOverrides.advertised.listeners is not set.
*/}}
{{- define "kafka.configuration.advertised.listeners" }}
{{- if (index .Values "configurationOverrides" "advertised.listeners") -}}
{{- printf ",%s" (first (pluck "advertised.listeners" .Values.configurationOverrides)) }}
{{- else -}}
{{- printf ",EXTERNAL://${HOST_IP}:$((%s + ${KAFKA_BROKER_ID}))" (.Values.nodeport.firstListenerPort | toString) }}
{{- end -}}
{{- end -}}

{{/*
Create a default fully qualified kafka headless name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
*/}}
{{- define "kafka.kafka-headless.fullname" -}}
{{- $name := "kafka-headless" -}}
{{- printf "%s" $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create a variable containing all the datadirs created.
*/}}

{{- define "kafka.log.dirs" -}}
{{- range $k, $e := until (.Values.persistence.disksPerBroker|int) -}}
{{- if $k}}{{- printf ","}}{{end}}
{{- printf "/opt/kafka/data-%d/logs" $k -}}
{{- end -}}
{{- end -}}

{{- define "kafka.prometheus.name" -}}
{{- $name := "prometheus-prometheus-kafka-exporter" -}}
{{- printf "%s" $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
