---
title: Command Reference
sidebar_label: Reference
---

## Api Login

Login into an Airy Core instance

```
airy api login [flags]
```

#### Options

```
  -e, --email string      Email (default "grace@example.com")
  -h, --help              help for login
  -p, --password string   Password (default "the_answer_is_42")
```

#### Options inherited from parent commands

```
      --apihost string      Airy Core HTTP API host (default "http://api.airy")
      --cli-config string   config file (default is $HOME/.airy/cli.yaml)
```

---

## Api Signup

Signs users up in Airy Core

```
airy api signup [flags]
```

#### Options

```
  -e, --email string       Email (default "grace@hopper.com")
  -f, --firstName string   First name (default "Grace")
  -h, --help               help for signup
  -l, --lastName string    Last name (default "Hopper")
  -p, --password string    Password (default "the_answer_is_42")
```

#### Options inherited from parent commands

```
      --apihost string      Airy Core HTTP API host (default "http://api.airy")
      --cli-config string   config file (default is $HOME/.airy/cli.yaml)
```

---

## Config Apply

Applies configuration values from airy.yaml configuration to an Airy Core instance

```
airy config apply [flags]
```

#### Options

```
  -h, --help   help for apply
```

#### Options inherited from parent commands

```
      --apihost string       Airy Core HTTP API host (default "http://api.airy")
      --cli-config string    config file (default is $HOME/.airy/cli.yaml)
      --config string        Configuration file for an Airy Core instance (default "./airy.yaml")
      --kube-config string   Kubernetes config file for the cluster of an Airy Core instance (default "~/.airy/kube.conf")
```

---

## Create

Creates an instance of Airy Core

```
airy create [flags]
```

#### Options

```
  -h, --help               help for create
      --namespace string   (optional) Kubernetes namespace that Airy should be installed to. (default "default")
      --provider string    One of the supported providers (aws|local|minikube). (default "local")
```

#### Options inherited from parent commands

```
      --apihost string      Airy Core HTTP API host (default "http://api.airy")
      --cli-config string   config file (default is $HOME/.airy/cli.yaml)
```

---

## Init

Inits your airy configuration

```
airy init [flags]
```

#### Options

```
  -h, --help   help for init
```

#### Options inherited from parent commands

```
      --apihost string      Airy Core HTTP API host (default "http://api.airy")
      --cli-config string   config file (default is $HOME/.airy/cli.yaml)
```

---

## Status

Reports the status of an Airy Core instance

```
airy status [flags]
```

#### Options

```
  -h, --help   help for status
```

#### Options inherited from parent commands

```
      --apihost string      Airy Core HTTP API host (default "http://api.airy")
      --cli-config string   config file (default is $HOME/.airy/cli.yaml)
```

---

## Ui

Opens the Airy Core UI in your local browser

```
airy ui [flags]
```

#### Options

```
  -h, --help   help for ui
```

#### Options inherited from parent commands

```
      --apihost string      Airy Core HTTP API host (default "http://api.airy")
      --cli-config string   config file (default is $HOME/.airy/cli.yaml)
```

---

## Version

Prints version information

```
airy version [flags]
```

#### Options

```
  -h, --help   help for version
```

#### Options inherited from parent commands

```
      --apihost string      Airy Core HTTP API host (default "http://api.airy")
      --cli-config string   config file (default is $HOME/.airy/cli.yaml)
```

---
