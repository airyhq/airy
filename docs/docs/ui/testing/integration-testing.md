---
title: Testing
sidebar_label: Integration Testing
---

The UI is tested with the end-to-end testing tool [Cypress](https://github.com/cypress-io/cypress).

You can find the tests in the airy repository at `/integration` They test the main features of the [Airy Live Chat Plugin](/sources/chatplugin/overview), the [Inbox](/ui/inbox/introduction), and the [Control Center](/ui/control-center/introduction). 

The tests are made to run on a local instance. 

Here is a step-by-step guide on how to run the tests locally: 

- First, make sure that all dependencies are up-to-date in your `airy` repository. 
In doubt, delete your `nodes_modules` and run `yarn install`.

- You need to have the [contacts feature](/ui/inbox/contacts) enabled (it is disabled by default). To enable it you need to set the `integration.contacts.enabled` field in your [airy.yaml config](getting-started/installation/configuration.md) to`true`.

- Run a local instance with the command `scripts/dev_cli.sh create --provider=minikube`

- Once your local instance is running, start the development server for the [Control Center](/ui/control-center/introduction) with the command `./scripts/web-dev.sh //frontend/control-center:bundle_server`

- Navigate to the `Catalog` page and install the `Airy Chat Plugin`. Once it is installed, navigate to the `Connectors` page, select `Airy Chat Plugin`, and add a new channel. Copy the channelID of the new channel and add it to the Cypress configuration file `/integration/cypress.config.ts` at `env.channelId`.

- Open the demo page by passing the `channel_id` as a query parameter, and write a message: 
`http://localhost/chatplugin/ui/example?channel_id=<channel_id>`

- Stop the development server of the Control Center, and start the development server of the [Inbox](/ui/inbox/introduction): `./scripts/web-dev.sh //frontend/inbox:bundle_server`


