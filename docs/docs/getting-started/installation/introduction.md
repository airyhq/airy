---
title: Install Airy Core
sidebar_label: Installation
---

import TLDR from "@site/src/components/TLDR";
import ButtonBoxList from "@site/src/components/ButtonBoxList";
import ButtonBox from "@site/src/components/ButtonBox";
import AwsSVG from "@site/static/icons/aws.svg";
import TerraformSVG from "@site/static/icons/terraform.svg";
import Minikube from "@site/static/icons/minikube.svg";
import RocketSVG from "@site/static/icons/rocket.svg";
import HelmSVG from "@site/static/icons/helm.svg";

<TLDR>

You can deploy Airy Core locally
to test and develop, or production-ready in your cloud.

 </TLDR>

We recommend [installing](/cli/introduction.md) the Airy CLI first which will
aid you in the process of installing and managing your Airy Core instance. It is
easy to install and works on macOS and Linux.

## Install the Airy CLI

<ButtonBoxList>
<ButtonBox
icon={<RocketSVG />}
iconInvertible={true}
title='CLI'
description='Install the Airy Core CLI application'
link='/cli/introduction'
/>
</ButtonBoxList>

## Install Airy Core

After you have installed your Airy CLI you can choose one of the following supported platforms and use the CLI to deploy `Airy Core`.

<ButtonBoxList>
<ButtonBox
icon={<HelmSVG />}
iconInvertible={true}
title='Helm'
description='Deploy Airy Core with Helm, on an existing Kubernetes cluster'
link='/getting-started/installation/helm'
/>
</ButtonBoxList>
<ButtonBoxList>
<ButtonBox
icon={<Minikube />}
title='Local test environment with Minikube'
description='Step by step guide to run Airy Core on your local machine'
link='getting-started/installation/minikube'
/>
<ButtonBox
icon={<AwsSVG />}
title='Production ready environment with AWS'
description='Step by step guide to run Airy Core on AWS'
link='getting-started/installation/aws'
/>
<ButtonBox
icon={<TerraformSVG />}
title='Cloud deployment with Terraform'
description='Step by step guide to run Airy Core in the cloud managed by Terraform'
link='getting-started/installation/terraform'
/>
</ButtonBoxList>
