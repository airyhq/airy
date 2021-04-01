# How to monitor Airy Core

## Why Prometheus

Prometheus has become the mainstream monitoring tool of choice in the container
and microservice world.

It provides ready-to-use
[Exporters](https://prometheus.io/docs/instrumenting/exporters/)
for all services that our system provides and implements a pull mechanism that
is better suited for microservice architecture.

Furthermore, it supports additional components like the [Alert
Manager](https://prometheus.io/docs/alerting/latest/alertmanager/),
[a query
language](https://prometheus.io/docs/prometheus/latest/querying/basics/) to
retrieve the data and visualization tools like
[Grafana](https://prometheus.io/docs/visualization/grafana/)
![image](https://user-images.githubusercontent.com/54705263/111768039-b2772200-88a7-11eb-9635-020895eb0c72.png

## Kubernetes Prometheus Stack

We are using the [Kube-Prometheus
Stack](https://github.com/prometheus-operator/kube-prometheus) developed by the
Prometheus community.

### Installing the helm chart

Make sure your kubectx is set to the Airy Core instance and you have Helm installed.

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install prometheus prometheus-community/kube-prometheus-stack
```

`kubectl --namespace monitoring port-forward svc/prometheus-k8s 9090`

### Customizing Prometheus

Many of Prometheus' parameters can be changed in the configuration file located
under `infrastructure/tools/prometheus/values.yaml`.

`helm upgrade prometheus --values infrastructure/tools/prometheus/values.yaml`

### Visualisation with Grafana

[Grafana](https://grafana.com/) is a very powerful visualization tool which can
used for all sorts of dashboard and monitoring requirements.

To access Grafana you can forward its port to http://localhost:3000 with the
following command
`kubectl port-forward svc/prometheus-grafana :80`

#### Load Predefined Dashboards

### Monitoring with alerts

### Aggregating data to a Prometheus server outside of the Kubernetes cluster

[Federation
Endppoint](https://prometheus.io/docs/prometheus/latest/federation/)

https://www.reddit.com/r/kubernetes/comments/c3gc39/monitoring_k8s_by_prometheus_outside_cluster/

https://medium.com/thg-tech-blog/monitoring-multiple-kubernetes-clusters-88cf34442fa3

https://www.robustperception.io/scaling-and-federating-prometheus
