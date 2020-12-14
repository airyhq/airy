<p align="center">
    <img width="350" src="./assets/airy_primary_rgb.svg" alt="Airy Logo" />

</p>

# [Airy](https://airy.co/)- A Conversational Data Platform to drive sales, improve marketing and provide better service


# Frontend

The Frontend section of the Airy core platform contains the user interaction(UI) related code.

They are grouped into four frontend sub-projects:

- `Components` [![npm version](https://badge.fury.io/js/name-suggestion-index.svg)](https://www.npmjs.com/package/@airyhq/components)

  Here you can find the Airy Component Library. We are open-sourcing (it's a work in progress) the critical components necessary to build a messaging application. We use this library to power our commercial offering.

- `Showcase`

  This directory contains a small React application that showcases the
  components of the [Airy Components Library](https://www.npmjs.com/package/@airyhq/components), we host the `main`
  branch version at [https://components.airy.co](https://components.airy.co).

- `Demo`

  The [Demo project](https://github.com/airyhq/airy/tree/develop/frontend/demo) is a minimum UI implementation of the provided [Airy Core Platform API](https://docs.airy.co/api/http). Unlike `showcase` it does not use the `npm` version of the `components` library, but instead uses the local repository version.

- `Chat_Plugin`

  This project is implements a UI for the [Chat Plugin Source](https://docs.airy.co/sources/chat-plugin) that can
  be installed as Javascript tag on websites.
