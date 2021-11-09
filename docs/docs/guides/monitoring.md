---
title: Monitoring
sidebar_label: Monitoring
---

## Why Prometheus

Prometheus has become the mainstream open source monitoring tool of choice in
the container and microservice world.

It provides ready-to-use
[Exporters](https://prometheus.io/docs/instrumenting/exporters/)
for all services that our system provides and implements a pull mechanism that
is better suited for microservice architecture.

Furthermore, it supports additional features like the [Alert
Manager](https://prometheus.io/docs/alerting/latest/alertmanager/),
[a query
language](https://prometheus.io/docs/prometheus/latest/querying/basics/) to
retrieve the data and the visualization tool
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
to put your hostname in the respective `hosts: []` variables in
`infrastructure/tools/prometheus/values.yaml` and then update the Kubernetes ingress with:

`helm upgrade prometheus --values infrastructure/tools/prometheus/values.yaml`

Now you can access Prometheus under `/prometheus`.

### Grafana Dashboards

[Grafana](https://grafana.com/) is a very powerful visualization tool which can
be used for all sorts of dashboarding and monitoring tasks.

For Grafana there is one more step to do before you can access it.

`k edit cm prometheus-grafana`

```toml
[server]
    domain = <your_hostname>
    root_url = <your_hostname>/grafana
    serve_from_sub_path = true
```

Now you can go to `<your-domain>/grafana` and login with the `adminPassword` you
set in the `values.yaml`.

#### Access Predefined Dashboards

If the `defaultDashboardsEnabled` is set to true you can find the default
Kubernetes dashboards under `/grafana/dashboards`

The Grafana website provides a lot more dashboards that can be added to your
instance by
[importing](https://grafana.com/docs/grafana/latest/dashboards/export-import/#import-dashboard)
them.

Here is a list of dashboard we recommend to add to monitor your Airy Core
instance

- [Spring apps](https://grafana.com/grafana/dashboards/12464)
- [Apache Kafka](https://grafana.com/grafana/dashboards/7589)

### Receiving alerts

To get notifications for the default alerts all you have to do is set up a
receiver like described
[here](https://grafana.com/docs/grafana/latest/dashboards/export-import/#import-dashboard).
That way you can get notified on Slack or PagerDuty on issues like crashing
components and nodes running out of free storage space.
