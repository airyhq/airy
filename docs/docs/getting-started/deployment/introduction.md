---
title: Introduction
sidebar_label: Introduction
---

import TLDR from "@site/src/components/TLDR";
import ButtonBox from "@site/src/components/ButtonBox";
import VagrantSVG from '@site/static/img/getting-started/deployment/introduction/vagrantup-icon.svg'
import ProductionSVG from '@site/static/img/getting-started/deployment/introduction/cloud-svgrepo-com.svg'

<TLDR>

You can deploy Airy Core in many different ways: **locally** or
**production-ready in your cloud**.

 </TLDR>

The following documentation covers how to install Airy Core locally (using
Vagrant) or deploy it with various hosting options.

## Deployment Guides

<ul style={{
    listStyleType: "none",
    padding: 0
}}>

<li style={{
    marginBottom: '12px'
}}>
<ButtonBox 
    icon={() => <VagrantSVG />}    
    title='Local test environment with Vagrant' 
    description='Step by step guide to run Airy Core on your local machine' 
    link='getting-started/deployment/vagrant'
/>
</li>

<li style={{
    marginBottom: '12px'
}}>
<ButtonBox 
    icon={() => <ProductionSVG />}    
    title='Production ready environment with Kafka' 
    description='Manual step by step guide for running Airy in production' 
    link='getting-started/deployment/production'
/>
</li>

</ul>
