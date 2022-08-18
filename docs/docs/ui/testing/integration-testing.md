---
title: Testing
sidebar_label: Integration Testing
---

The UI is tested with the end-to-end testing tool [Cypress](https://github.com/cypress-io/cypress).

You can find the tests in the airy repository at `/integration`. They test the main features of the UI on the Airy Chat Plugin, the Inbox, and the Control Center. 

The tests are made to run on a local instance. 

Here is a step-by-step guide on how to run the tests locally: 

- Make sure that all dependencies are up-to-date in your `airy` repository. 
In doubt, delete your `nodes_modules` and run `yarn install`.

- airy yaml: api-contacts

- Run a local instance with the command `scripts/dev_cli.sh create --provider=minikube`

- Once the process successfully finishes, start the development server for the Control Center:
`./scripts/web-dev.sh //frontend/control-center:bundle_server`

- 