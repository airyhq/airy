---
title: Installation
sidebar_label: Installation
---

import TLDR from "@site/src/components/TLDR";
import Box from "@site/src/components/Box";
import useBaseUrl from '@docusaurus/useBaseUrl';
import DeploySVG from '@site/static/img/getting-started/installation/deploy.svg'

<TLDR>

You can install Airy Core from **many possible installation options**, locally
or in the cloud.

</TLDR>

### Command Line Interface

The [Airy CLI](/cli/introduction.md) is a developer tool to help you **build**, **test**, and **manage** Airy directly from your terminal.

We recommend to [install](/cli/installation.md) the Airy CLI first which will
aid you in the process of installing and managing your Airy Core instance.

It is easy to install and works on macOS, Windows, and Linux.

## Installation guides

<ul style={{
    listStyleType: "none",
    padding: 0
}}>

<li style={{
    marginBottom: '12px'
}}>
<Box 
    icon={() => <DeploySVG />}
    title='CLI' 
    description='Run Airy on your local machine using the CLI' 
    link='/cli/installation'
/>
</li>

<li style={{
    marginBottom: '12px'
}}>
<Box     
    title='Run Airy Core on your machine inside an isolated Vagrant' 
    description='Run Airy Core on your machine inside an isolated Vagrant' 
    link='/getting-started/deployment/production'
/>
</li>

<li style={{
    marginBottom: '12px'
}}>
<Box     
    title='Run Airy Core in the cloud' 
    description='Run Airy Core in the cloud' 
    link='/getting-started/deployment/production'
/>
</li>

</ul>
