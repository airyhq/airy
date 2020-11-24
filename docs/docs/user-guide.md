---
id: user-guide
title: User Guide
sidebar_label: User Guide
slug: /user-guide
---

The goal of this document is to provide an overview of how to run the Airy Core
Platform.

## Running the platform on your machine

We built a virtual machine with [Vagrant](https://www.vagrantup.com) that allows
you to create a virtual machine (box). The box contains [K3OS](https://k3os.io/),
a pre-configured kubernetes cluster, to deploy and run all the Airy Core Platform
components.

To get started, run the following commands:

```sh
$ git clone https://github.com/airyhq/airy
$ cd airy
$ ./scripts/bootstrap.sh
```

The script will ask for your password as we are using the [Vagrant Host Manager Plugin](https://github.com/devopsgroup-io/vagrant-hostmanager) to add entries to your hosts file. You can skip this step and add the following lines to your hosts file yourself.

```
192.168.50.5  demo.airy
192.168.50.5  api.airy
192.168.50.5  chatplugin.airy
```

## Sending messages to the platform
### 1. Connecting a chatplugin source

You can start connecting any source but the chatplugin is well suited to be the first because it doesn't have any outside dependencies. Make sure that the user you authenticate with exists.

```
token=$(echo $(curl -H 'Content-Type: application/json' -d \
"{ \
\"email\":\"grace@example.com\", \
\"password\":\"the_answer_is_42\" \
}" api.airy/users.login) | jq -r '.token')
curl -H "Content-Type: application/json" -H "Authorization: $token" -d \
"{ \
    \"source\": \"chat_plugin\", \
    \"source_channel_id\": \"my-chat-channel-1\", \
    \"name\": \"chat plugin source\" \
}" api.airy/channels.connect
```




Note the id from the response because that is the channel id which we will need in the next step.

### 2. Sending messages with the chatplugin

Pass the channel id as query parameter when opening the demo page in your browser. This will authenticate the chatplugin and enable you to send messages immedietly. 

http://chatplugin.airy/example.html?channel_id=<channel_id>

Next simply type your message in the plugin and send it.

### 3. Receiving messages in the core platform

Finally, request all conversations for the channel you just created which should return the message you just sent.

```
curl -H "Content-Type: application/json" -H "Authorization: $token" -d \
"{ \
    \"filter\": \
        { \
            \"channel_ids\": [\"<channel_id>\"] \
        } \
}" api.airy/conversations.list | jq .
```

If you want to consume the messages directly from the topic you can do so with:

```
vagrant ssh
k exec -it airy-cp-kafka-0 -- /bin/bash
kafka-console-consumer \
--bootstrap-server airy-cp-kafka:9092 \
--topic application.communication.messages --from-beginning
```

## Debug your installation

You can ssh inside the Airy Core Platform box for testing and debugging purposes
like so:

```sh
$ cd infrastructure
$ vagrant status
$ vagrant ssh
$ kubectl get pods # to see what's running inside the kubernetes cluster
```

You can stop, start or restart the Airy Core Platform box with the following
commands:

```sh
$ cd infrastructure
$ vagrant halt
$ vagrant start
$ vagrant reload
```

You can delete and re-create the whole environment with the following commands:

```sh
$ cd infrastructure
$ vagrant destroy
$ vagrant up
```

### Airy Core API and Public webhooks

You can find your current webhook URLs and your API local address running the
following commands:

```sh
$ cd infrastructure
$ vagrant ssh
$ /vagrant/scripts/status.sh
```
or
```sh
$ cd infrastructure
$ vagrant ssh -c /vagrant/scripts/status.sh
```

### Uninstall the Airy Core Platform Box

You can remove the Airy Core Platform Box from your machine completely running
the following commands:

```sh
$ cd infrastructure
$ vagrant destroy
```
