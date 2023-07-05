---
title: Postgresql
sidebar_label: Postgresql
---

[PostgreSQL](https://www.postgresql.org/), also known as Postgres, is a free and open-source relational database management system emphasizing extensibility and SQL compliance.

By install ing the Postgresql component, a complete Postgresql server will be installed with a Service that can be reached on the `postgresql` host and port `5432` from inside the Kubernetes cluster. At the moment the Postgresql instance is only available from inside the cluster and it cannot be reached from the outside.

The Postgresql Helm chart can be installed either from the Catalog in the `Control Center` or by running `helm install`:

```
helm repo add airy https://helm.airy.co
helm repo update
helm install postgresql airy/postgresql
```

The default version is `15.1` but this can be modified by overwriting the `--set version` value, when deploying the Helm chart.

To retrieve the administrative Postgresql password run:

```
kubectl get secret postgresql -o jsonpath='{.data.postgresql-password}' | base64 -d
```

Note that the password changes everytime that the helm chart is updated. Would be best to use it as an environmental variable in the pod, mounted directly from the `postgresql` secret.
