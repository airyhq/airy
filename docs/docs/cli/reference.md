---
title: Command Reference
sidebar_label: Reference
---

## Api Endpoint

Get the endpoint of the Airy Core API

```
airy api endpoint [flags]
```

#### Options

```
  -h, --help   help for endpoint
```

#### Options inherited from parent commands

```
      --apihost string      Airy Core HTTP API endpoint
      --config-dir string   config directory of an airy core instance (default is the cwd)
```


***

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
      --apihost string      Airy Core HTTP API endpoint
      --config-dir string   config directory of an airy core instance (default is the cwd)
```


***

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
      --apihost string      Airy Core HTTP API endpoint
      --config-dir string   config directory of an airy core instance (default is the cwd)
```


***

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
      --apihost string      Airy Core HTTP API endpoint
      --config-dir string   config directory of an airy core instance (default is the cwd)
```


***

## Create

Creates an instance of Airy Core

#### Synopsis

Creates a config directory (default .) with default configuration and starts an Airy Core instance using the given provider

```
airy create [config directory] [flags]
```

#### Options

```
  -h, --help               help for create
      --init-only          Only create the airy config directory and exit
      --namespace string   (optional) Kubernetes namespace that Airy should be installed to. (default "default")
      --provider string    One of the supported providers (aws|minikube). (default "minikube")
```

#### Options inherited from parent commands

```
      --apihost string      Airy Core HTTP API endpoint
      --config-dir string   config directory of an airy core instance (default is the cwd)
```


***

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
      --apihost string      Airy Core HTTP API endpoint
      --config-dir string   config directory of an airy core instance (default is the cwd)
```


***

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
      --apihost string      Airy Core HTTP API endpoint
      --config-dir string   config directory of an airy core instance (default is the cwd)
```


***

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
      --apihost string      Airy Core HTTP API endpoint
      --config-dir string   config directory of an airy core instance (default is the cwd)
```


***

