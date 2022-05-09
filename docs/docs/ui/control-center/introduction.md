---
title: Control Center
sidebar_label: Introduction
---

import ButtonBoxList from "@site/src/components/ButtonBoxList";
import ButtonBox from "@site/src/components/ButtonBox";
import ComponentsSVG from "@site/static/icons/componentsIcon.svg";
import ConnectorsSVG from "@site/static/icons/connectorsIcon.svg";
import CatalogSVG from "@site/static/icons/catalogIcon.svg";
import WebhooksSVG from "@site/static/icons/webhooksIcon.svg";
import useBaseUrl from '@docusaurus/useBaseUrl';

The Control Center serves as the technical dashboard of your Airy Core app.

It provides both a graphical overview and a way to manage your app's [components](/getting-started/components), [connectors](connectors), and [webhooks](/api/webhook). Its [catalog](catalog) enables you to choose and configure additional [connectors](connectors).

<ButtonBoxList>
    <ButtonBox
        icon={<ComponentsSVG />}
        iconInvertible={true}
        title='Status'
        description="Get an overview and manage your app's components and their status"
        link='ui/control-center/status'
    />
    <ButtonBox
        icon={<ConnectorsSVG />}
        title='Connectors'
        iconInvertible={true}
        description="View and configure your app's connectors"
        link='ui/control-center/connectors'
    />
     <ButtonBox
        icon={<CatalogSVG />}
        title='Catalog'
        iconInvertible={true}
        description="Add connectors to your app in just a few clicks"
        link='ui/control-center/catalog'
    />
     <ButtonBox
        icon={<WebhooksSVG />}
        title='Webhooks'
        iconInvertible={true}
        description="Manage, update and connect webhooks"
        link='ui/control-center/webhooks'
    />
</ButtonBoxList>

<br />

Screenshots of the Control Center's Status, Connectors, and Catalog pages.
<img alt="Control Center Status Demo"src={useBaseUrl('img/ui/controlCenterStatus.png')} />
<img alt="Control Center Connectors Demo "src={useBaseUrl('img/ui/controlCenterConnectors.png')} />
<img alt="Control Center Catalog Demo"src={useBaseUrl('img/ui/controlCenterCatalog.png')} />
<img alt="Control Center Webhooks Demo"src={useBaseUrl('img/ui/controlCenterWebhooks.png')} />
