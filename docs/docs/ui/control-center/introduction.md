---
title: Control Center
sidebar_label: Introduction
---

import ButtonBoxList from "@site/src/components/ButtonBoxList";
import ButtonBox from "@site/src/components/ButtonBox";
import ComponentsSVG from "@site/static/icons/componentsIcon.svg";
import ConnectorsSVG from "@site/static/icons/connectorsIcon.svg";
import CatalogSVG from "@site/static/icons/catalogIcon.svg";
import useBaseUrl from '@docusaurus/useBaseUrl';

The Control Center serves as a technical dashboard: it provides a graphical overview of an Airy Core instance's [components](/getting-started/components) and [connectors](connectors) while its [catalog](catalog) enables to choose and configure additional [connectors](connectors).

<ButtonBoxList>
    <ButtonBox
        icon={<ComponentsSVG />}
        iconInvertible={true}
        title='Components'
        description="Get an overview of your app's components and their status"
        link='ui/control-center/components'
    />
    <ButtonBox
        icon={<ConnectorsSVG />}
        title='Connectors'
        iconInvertible={true}
        description="View and manage your app's connectors"
        link='ui/control-center/connectors'
    />
     <ButtonBox
        icon={<CatalogSVG />}
        title='Catalog'
        iconInvertible={true}
        description="Add connectors to your app in just a few clicks"
        link='ui/control-center/catalog'
    />
</ButtonBoxList>

<br />

Screenshots of the Control Center UI:
<img alt="Control Center Components Demo"src={useBaseUrl('img/ui/controlCenterComponents.png')} />
<img alt="Control Center Connectors Demo "src={useBaseUrl('img/ui/controlCenterConnectorsDemo.png')} />
<img alt="Control Center Catalog Demo"src={useBaseUrl('img/ui/controlCenterCatalogDemo.png')} />
