---
title: Backup & restore
sidebar_label: Backup & restore
---

import useBaseUrl from '@docusaurus/useBaseUrl';
import TLDR from "@site/src/components/TLDR";
import SuccessBox from "@site/src/components/SuccessBox";
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ButtonBox from "@site/src/components/ButtonBox";
import DiamondSVG from "@site/static/icons/diamond.svg";

<TLDR>
How to backup and restore your Airy Core instance.
</TLDR>

## Backup

All the application data, including all the configured sources, channels and templates, are stored in Kafka. As Kafka needs Zookeeper to run properly, the Kafka operational data is stored in Zookeeper. Both Kafka and Zookeeper are deployed as statefulsets in Kubernetes and all the data is stored in PersistentVolumes, provisioned by PersistentVolumeClaims. The location of the persistent volumes is dependent of your implementation. For example, in AWS the Elastic Block Store (EBS) is used to manage the volumes.

:::note

It is best to do backup of the Kafka volumes when the Kafka brokers are stopped, in order to avoid inconsistencies.

:::

To view the PersistentVolumeClaims and PersistentVolumes run:

```
$ kubectl get pvc
NAME                    STATUS  VOLUME                  CAPACITY  ACCESS MODES  STORAGECLASS  AGE
datadir-0-kafka-0       Bound   airy-kafka              10Gi      RWO           gp2           143m
datadir-zookeeper-0     Bound   airy-zookeeper          5Gi       RWO           gp2           119m
datalogdir-zookeeper-0  Bound   airy-zookeeper-datalog  5Gi       RWO           gp2           105m

$ kubectl get pv
NAME                    CAPACITY  ACCESS MODES  RECLAIM POLICY  STATUS  CLAIM                           STORAGECLASS REASON AGE
airy-kafka              10Gi      RWO           Delete          Bound   default/datadir-0-kafka-0       gp2                 155m
airy-zookeeper          5Gi       RWO           Delete          Bound   default/datadir-zookeeper-0     gp2                 128m
airy-zookeeper-datalog  5Gi       RWO           Delete          Bound   default/datalogdir-zookeeper-0  gp2                 114m
```

To Backup all your data, you should make periodical snapshots or backup of the PersistentVolumes.

All the credentials and configurations of the Airy Core instance, is stored in your `airy.yaml` file.

## Restore

You can restore your Airy Core instance in an empty Kubernetes cluster, by restoring the Kafka and Zookeeper PersistentVolumes (PV) and PersistentVolumeClaims (PVC).

Once you have your volumes restored, either from a backup location or from snapshots, you can create the PVs using the following Kubernetes manifests.

```
curl -L -s https://raw.githubusercontent.com/airyhq/airy/develop/infrastructure/tools/restore/pv.yaml -O pv.yaml
```

Modify the file according to your infrastructure configuration by specifying VOLUME_ID, AVAILABILITY_ZONE and REGION.

Apply the Kubernetes manifest to create the PV resources

```
$ kubectl apply -f ./pv.yaml
persistentvolume/restored-kafka created
persistentvolume/restored-zookeeper created
persistentvolume/restored-zookeeper-datalog created
```

Run the following command to create the necessary PVCs:

```
kubectl apply -f https://raw.githubusercontent.com/airyhq/airy/develop/infrastructure/tools/restore/pvc.yaml
persistentvolumeclaim/datadir-0-kafka-0 created
persistentvolumeclaim/datadir-zookeeper-0 created
persistentvolumeclaim/datalogdir-zookeeper-0 created
```

Once the storage is restored, transform your `airy.yaml` file to be compatible with `Helm` and install the Helm chart for `Airy Core`, with the desired version:

```
echo "global:" > helm .yaml
cat airy.yaml | sed 's/^/  /' >> helm.yaml
export AIRY_VERSION="0.30.0"
helm install airy https://helm.airy.co/charts/airy-${AIRY_VERSION}-alpha.tgz --values ./helm.yaml --timeout 10m0s
```

Apply your `airy.yaml` configuration.

```
airy config apply
```

## Potential issues

### Data inconsistencies in Kafka

In rare cases, when the backup is performed on a running Kafka instance, there can be some inconsistencies in the internal topics, in the restored Kafka instance.

This can be resolved by resetting the Kafka streaming apps, to beginning or to latest, depending on the setting of the particular app. Refer to the [Airy component reset guide](/guides/component-reset).
