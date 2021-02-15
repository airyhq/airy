---
title: Reference
sidebar_label: CLI Reference
---

## airy

airy controls an Airy Core instance

#### Options

```
      --apihost string      Airy Core HTTP API host (default "http://api.airy")
      --cli-config string   config file (default is $HOME/.airy/cli.yaml)
  -h, --help                help for airy
```

#### SEE ALSO

* [airy api](reference#airy-api)	 - Interacts with the Airy Core HTTP API
* [airy config](reference#airy-config)	 - Manages an Airy Core instance via airy.yaml
* [airy init](reference#airy-init)	 - Inits your airy configuration
* [airy status](reference#airy-status)	 - Reports the status of an Airy Core instance
* [airy ui](reference#airy-ui)	 - Opens the Airy Core UI in your local browser
* [airy version](reference#airy-version)	 - Prints version information

***

## airy api

Interacts with the Airy Core HTTP API

#### Options

```
  -h, --help   help for api
```

#### Options inherited from parent commands

```
      --apihost string      Airy Core HTTP API host (default "http://api.airy")
      --cli-config string   config file (default is $HOME/.airy/cli.yaml)
```

#### SEE ALSO

* [airy](reference#airy)	 - airy controls an Airy Core instance
* [airy api login](reference#airy-api-login)	 - Login into an Airy Core instance
* [airy api signup](reference#airy-api-signup)	 - Signs users up in Airy Core

***

## airy api login

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

#### SEE ALSO

* [airy api](reference#airy-api)	 - Interacts with the Airy Core HTTP API

***

## airy api signup

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

#### SEE ALSO

* [airy api](reference#airy-api)	 - Interacts with the Airy Core HTTP API

***

## airy config

Manages an Airy Core instance via airy.yaml

#### Options

```
      --config string        Configuration file for an Airy Core instance (default "./airy.yaml")
  -h, --help                 help for config
      --kube-config string   Kubernetes config file for the cluster of an Airy Core instance (default "~/.airy/kube.conf")
```

#### Options inherited from parent commands

```
      --apihost string      Airy Core HTTP API host (default "http://api.airy")
      --cli-config string   config file (default is $HOME/.airy/cli.yaml)
```

#### SEE ALSO

* [airy](reference#airy)	 - airy controls an Airy Core instance
* [airy config apply](reference#airy-config-apply)	 - Applies configuration values from airy.yaml configuration to an Airy Core instance

***

## airy config apply

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

#### SEE ALSO

* [airy config](reference#airy-config)	 - Manages an Airy Core instance via airy.yaml

***

## airy init

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

#### SEE ALSO

* [airy](reference#airy)	 - airy controls an Airy Core instance

***

## airy status

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

#### SEE ALSO

* [airy](reference#airy)	 - airy controls an Airy Core instance

***

## airy ui

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

#### SEE ALSO

* [airy](reference#airy)	 - airy controls an Airy Core instance

***

## airy version

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

#### SEE ALSO

* [airy](reference#airy)	 - airy controls an Airy Core instance

***

