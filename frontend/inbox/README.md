<p align="center">
    <img width="850" src="assets/airy_demo_login.png" alt="Airy Login" />
    </a>
</p>

### Airy Demo UI

The Airy UI is a fully featured user interactive frontend project that showcases Airy Core features. It enables users to experience the functionalities of Airy Core.

- [Airy Demo UI](#airy-demo-ui)
- [Prerequisites](#prerequisites)
- [Building Airy Demo UI](#building-airy-demo-ui)
- [Installation](#installation)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
- [Development](#development)

### Prerequisites

- [Node.js](https://nodejs.org/) version 10 or newer
- [Git](https://www.atlassian.com/git/tutorials/install-git/) for your platform
- [Bazel](https://docs.bazel.build/versions/3.7.0/install.html) for building and testing the app

### Building Airy Demo UI

You can run the backend required for development of the Airy Demo UI locally by installing Airy Core using the
[minikube provider](/docs/docs/getting-started/installation/minikube.md):

To ensure that you develop against the latest state of the `create` command you can build and run the executable
from the repository:

```
$ bazel run //cli -- create --provider=minikube
```

When the bootstrap process finishes, open another terminal and run `$ ./scripts/web-dev.sh //frontend/inbox:bundle_server`
Then open `http://localhost:8080/` in a web browser to access the Airy Demo UI

### Authentication

In order to communicate with our API endpoints, you need a valid [JWT](https://jwt.io/) token. To get a valid token you first need to signup using the signup [endpoint](#endpoints) and then login using the login [endpoint](#endpoints).

### Endpoints

Aside from Curl, [PostMan](https://www.postman.com/downloads/) and other API testing tools could also be used to access the endpoints.

### Development

To start the app in development mode, run these commands:

```
$ yarn
$ ./scripts/web-dev.sh //frontend/inbox:bundle_server
```

After it started, open a web browser to [`localhost:8080`](http://localhost:8080). Login with the user you created above.

The web server does not perform Typescript type checking. To do so you can either run type checks after you are done
or start another process:

```
$ ibazel build //frontend/inbox:app
```
