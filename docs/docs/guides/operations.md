---
title: How to monitor Airy Core
sidebar_label: Operations
---

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

![image](https://user-images.githubusercontent.com/54705263/111768039-b2772200-88a7-11eb-9635-020895eb0c72.png)

## Kubernetes Prometheus Stack

We are using the [Kube-Prometheus
Stack](https://github.com/prometheus-operator/kube-prometheus) developed by the
Prometheus community.

### Installing the helm chart

Make sure your kubectx is set to the Airy Core instance and you have [Helm](https://helm.sh/) installed.

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install prometheus prometheus-community/kube-prometheus-stack
```

### Customizing Prometheus

To access Prometheus, Grafana and Alertmanager from outside the cluster you have
to put your hostname in the respective `hosts: []` variable in
`infrastructure/tools/prometheus/values.yaml` and then create the Kubernetes ingress with:

`helm upgrade prometheus --values infrastructure/tools/prometheus/values.yaml`

Now you can access Prometheus under `/prometheus`.

### Grafana Dashboards

[Grafana](https://grafana.com/) is a very powerful visualization tool which can
be used for all sorts of dashboard and monitoring requirements.

`k edit cm prometheus-grafana`

```toml
[server]
    domain = <your_hostname>
    root_url = <your_hostname>/grafana
    serve_from_sub_path = true
```

Access Grafana under `/grafana` and login with the
`adminPassword` you set in the `values.yaml`.

#### Access Predefined Dashboards

If the `defaultDashboardsEnabled` is set to true you can find the default
Kubernetes dashboards under `/grafana/dashboards`

For the spring apps we recommend to import this
(dashboard)[https://grafana.com/grafana/dashboards/12464].

And for Kafka this (dashboard)[https://grafana.com/grafana/dashboards/7589].

### Monitoring with alerts

Access the Alertmanager under `/alertmanager`.
