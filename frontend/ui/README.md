<p align="center">
    <img width="850" src="../assets/airy_demo_login.png" alt="Airy Login" />
    </a>
</p>


### Airy Demo UI

The Airy Demo UI is a minimal user interactive frontend project that showcases the Airy Core Platform API.It enables users to experience the functionalities of our Airy Core Platform.


- [Airy Demo UI](#airy-demo-ui)
- [Prerequisites](#prerequisites)
- [Building Airy Demo UI](#building-airy-demo-ui)
- [Installation](#installation)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
- [Development](#development)

### Prerequisites

* [Node.js](https://nodejs.org/) version 10 or newer
* [Git](https://www.atlassian.com/git/tutorials/install-git/) for your platform
* [Bazel](https://docs.bazel.build/versions/3.7.0/install.html) for building and testing the app


### Building Airy Demo UI

You can run the Airy Demo UI locally by running the following commands:

```
$ git clone https://github.com/airyhq/airy
$ cd airy
$ ./scripts/bootstrap.sh (Takes a few minutes)
```
When the bootstrap process finishes, open another terminal and run ``` $ ibazel run //frontend/demo:bundle_server ```
Then open `http://localhost:8080/` in a web browser to access the Airy Demo UI

### Installation
The bootstrap installation requires [Vagrant](https://www.vagrantup.com/downloads) and [VirtualBox](https://www.virtualbox.org/wiki/Downloads). If they are not
found, the script ```$ ./scripts/bootstrap.sh``` will attempt to install them for you. Check out our [test deployment guide](/docs/docs/getting-started/deployment/test-environment.md) for detailed information.

### Authentication

In order to communicate with our API endpoints, you need a valid [JWT](https://jwt.io/) token. To get a valid token you first need to signup using the signup [endpoint](#endpoints) and then login using the login [endpoint](#endpoints).

### Endpoints
   To communicate with our signup endpoint and register your email, open another terminal and type in the terminal ```curl -X POST -H 'Content-Type: application/json' -d '{"first_name": "your_name","last_name": "your_last_name","password": "your_password","email": "your_email@airy.co"}' http://api.airy/users.signup```

   To sign in, type in the terminal ```token=$(echo $(curl -H 'Content-Type: application/json' -d \"{ \\"email\":\"your_email@airy.co\",\\"password\":\"your_last_name\" \}" api.airy/users.login) | jq -r '.token')```

Aside from Curl, [PostMan](https://www.postman.com/downloads/) and other API testing tools could also be used to access the endpoints.

### Development

To start the app in development mode, run these commands:

```
yarn
yarn ibazel run //frontend/ui:bundle_server
```

After it started, open a web browser to [`localhost:8080`](http://localhost:8080). Login with the user you created above.