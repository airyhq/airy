---
title: Integration Testing
sidebar_label: Integration Testing
---

import useBaseUrl from '@docusaurus/useBaseUrl';
import SuccessBox from "@site/src/components/SuccessBox";

We use the end-to-end testing tool [Cypress](https://docs.cypress.io/guides/overview/why-cypress) to test
the main features of the [Airy Live Chat Plugin](/connectors/sources/chatplugin/overview), the [Inbox](/ui/inbox/introduction), and the [Control Center](/ui/control-center/introduction).

You can find the tests in the airy repository at `/integration`. The tests are intended to be run on a local instance; a few values need to be configured before the tests can be run.

Here is a step-by-step guide to running the tests locally:

- First, make sure that all dependencies are up-to-date in your `airy` repository.
  In doubt, delete your `nodes_modules` and run `yarn install`.

- You need to have the [contacts feature](/ui/inbox/contacts) enabled (it is disabled by default). To enable it, set the `integration.contacts.enabled` field in your [airy.yaml config](getting-started/installation/configuration.md) to `true`.

- Run a local instance with the command `scripts/dev_cli.sh create --provider=minikube`. [Apply the configuration](/getting-started/installation/configuration#applying-the-configuration) once the process is finished.

- Next, start the development server for the [Control Center](/ui/control-center/introduction) with the command: <br/>
  `./scripts/web-dev.sh //frontend/control-center:bundle_server`

- Navigate to the `Catalog` page and install the [Airy Live Chat Plugin](/connectors/sources/chatplugin/overview). Once it is installed, navigate to the `Connectors` page, select `Airy Chat Plugin`, and add a new channel.

- Copy the channelID of the new channel and add it to the [Cypress](https://docs.cypress.io/guides/overview/why-cypress) configuration file `/integration/cypress.config.ts` at `env.channelId`.

- Open the demo page by passing the `channel_id` as a query parameter:<br/>
  `http://localhost/chatplugin/ui/example?channel_id=<channel_id>` <br/>
  Write a message in the chat.

- Start the development server of the [Inbox](/ui/inbox/introduction): <br/>
  `./scripts/web-dev.sh //frontend/inbox:bundle_server`

- You should see the conversation of the [Airy Live Chat Plugin](/connectors/sources/chatplugin/overview) channel you just created. Copy its conversationID (it is the id that is passed in its URL) and add it to the configuration file `/integration/cypress.config.ts` at `env.conversationId`.

- Then, copy the id of the conversation's message and add it to the configuration file `/integration/cypress.config.ts` at `env. messageId` (you can find the message's id by inspecting its DOM element, as the id is passed to the DIV as a key).

<SuccessBox>

You are now ready to run the tests on your local instance 🎉

</SuccessBox>

- Start the development server for the [Control Center](/ui/control-center/introduction) with the command `./scripts/web-dev.sh //frontend/control-center:bundle_server`

- Open the [Cypress dashboard](https://docs.cypress.io/guides/dashboard/introduction) with the command: `/node_modules/.bin/cypress open -C integration/cypress.config.ts`

The dashboard lists all tests. You can run tests by clicking on each item on the list.

<img alt="Create Tags"src={useBaseUrl('img/ui/cypressDashboard.png')} />
