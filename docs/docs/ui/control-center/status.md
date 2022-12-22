---
title: Status
sidebar_label: Status
---

import useBaseUrl from '@docusaurus/useBaseUrl';
import Red from "@site/static/icons/uncheckIconRed.svg";
import Yellow from "@site/static/icons/uncheckIconYellow.svg";
import Green from "@site/static/icons/checkmarkFilled.svg";
import Gray from "@site/static/icons/uncheckIconGray.svg";

The Status section of the [Control Center](/ui/control-center/introduction) provides a high-level overview of all your Airy Core app's [components](/getting-started/components) and their status. It also allows you to enable [components](/getting-started/components) through a toggle and see their status change in real time.

We have four states to reflect the component status in the cluster:

|    Icon    | Description                                                                                                                       |
| :--------: | --------------------------------------------------------------------------------------------------------------------------------- |
|  <Red />   | Services are not running, but they are targeting pods and can be healthy or not, depending if all the underlying pods are healthy |
| <Yellow /> | Component needs configuration                                                                                                     |
|  <Green/>  | Component/pods are running                                                                                                        |
|  <Gray/>   | Component is disabled and not running                                                                                             |

<br/>

The data displayed in this comprehensible table is served by the [client.config endpoint](/api/endpoints/client-config).

<img alt="Control Center"src={useBaseUrl('img/ui/controlCenterStatus.png')} />
