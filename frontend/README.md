# Frontend

The `frontend` top-level folder of the Airy Core Platform
[monorepo](https://en.wikipedia.org/wiki/Monorepo) contains the UI related code
of the platform.

Here is a quick introduction to the frontend projects:

- `components`

  Here you can find the [Airy
  Components Library](https://www.npmjs.com/package/@airyhq/components library. We are open-sourcing
  (it's a work in progress) the critical components necessary to build a
  messaging application. We use this library to power our commercial offering.

- `showcase`

  This directory contains a small React application that showcases the
  components of the [Airy Components
  Library](https://www.npmjs.com/package/@airyhq/components), we host the `main`
  branch version at [https://components.airy.co](https://components.airy.co).

- `demo`

  This project is a minimum UI implementation of the provided [Airy Core Platform API](https://docs.airy.co/api/http).
  Unlike `showcase` it does not use the `npm` version of the `components` library, but instead uses the
  local repository version.

- `chat_plugin`

  This project is implements a UI for the [Chat Plugin Source](https://docs.airy.co/sources/chat-plugin) that can
  be installed as Javascript tag on websites.
