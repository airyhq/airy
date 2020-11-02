# Infrastructure

- [Infrastructure](#infrastructure)
  - [Components](#components)
  - [Networking](#networking)

## Components

The Airy Core Platform components require the following systems to run:

- A [Kafka](https://kafka.apache.org) cluster (which in turn requires [zookeeper](https://zookeeper.apache.org))
- The [Confluent Schema registry](https://github.com/confluentinc/schema-registry)
- A [PostgreSQL](https://www.postgresql.org/) database

We also provide Kubernetes manifests for the Airy Core Platform applications,
they are located in [this folder](/infrastructure/deployments). If you need to
customize any aspect of the deployment process, the `../scripts/bootstrap.sh`
and `provisioning.sh` scripts are good entry-points.

## Networking

As the Airy Core Platform runs in Kubernetes, we created a service that exposes
an [Istio](https://istio.io/) ingress controller, located inside Minikube.
Through that ingress controller, the internal services are exposed and can be
accessed from outside of Minikube.

Since Minikube clusters are usually not exposed to the public internet, we
included an ngrok client to facilitate the integration of sources (via
webhooks).

In order for the Airy Core Platform to be accessible from the outside (for
example from Facebook, in order to send events to the Facebook webhook), the
system must have public access. To facilitate the process, we included a
[ngrok](https://ngrok.com/) client deployment inside the cluster. The ngrok
client connects to our hosted ngrok server at `tunnel.airy.co`, creates a unique
public endpoint (ex. https://some-random-string.tunnel.airy.co/facebook) and redirects
the traffic to the local Facebook webhook pod. When starting, the Airy Core
Platform prints the public URL for the Facebook webhook. You can also check it
by running the `/vagrant/scripts/status.sh` script from inside the Airy Core
Platform box or directly:
```sh
vagrant ssh -c /vagrant/scripts/status.sh
```
