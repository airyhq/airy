---
title: Postgresql
sidebar_label: Postgresql
---

[PostgreSQL](https://www.postgresql.org/), also known as Postgres, is a free and open-source relational database management system emphasizing extensibility and SQL compliance.

By install ing the Postgresql component, a complete Postgresql server will be installed with a Service that can be reached on the `postgresql` host and port `5432` from inside the Kubernetes cluster. At the moment the Postgresql instance is only available from inside the cluster and it cannot be reached from the outside.

To retrieve the administrative Postgresql password run:

```
kubectl get secret postgresql -o jsonpath='{.data.postgresql-password}' | base64 -d
```
