---
title: Install Airy Core
sidebar_label: Introduction
---

import useBaseUrl from "@docusaurus/useBaseUrl";
import TLDR from "@site/src/components/TLDR";
import ButtonBoxList from "@site/src/components/ButtonBoxList";
import ButtonBox from "@site/src/components/ButtonBox";
import KafkaSVG from "@site/static/icons/kafka.svg";
import Minikube from "@site/static/icons/minikube.svg";
import RocketSVG from "@site/static/icons/rocket.svg";

<TLDR>

You can deploy Airy Core in many different ways: **locally** or
**production-ready in your cloud**.

 </TLDR>

We recommend to [install](/cli/installation.md) the Airy CLI first which will
aid you in the process of installing and managing your Airy Core instance. It is
easy to install and works on macOS, Windows, and Linux.

## Installation Guides

<ButtonBoxList>
<ButtonBox
icon={() => <RocketSVG />}
title='CLI'
description='Install the Airy Core CLI application'
link='/cli/installation'
/>
<ButtonBox
icon={() => <Minikube />}
title='Local test environment with Minikube'
description='Step by step guide to run Airy Core on your local machine'
link='getting-started/installation/minikube'
/>
<ButtonBox
icon={() => <KafkaSVG />}
title='Production ready environment with Kafka'
description='Manual step by step guide for running Airy Core in production'
link='getting-started/installation/production'
/>
</ButtonBoxList>
