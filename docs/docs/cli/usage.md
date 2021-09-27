---
title: Command Usage
sidebar_label: Usage
---

## Api

Interacts with the Airy Core HTTP API

### Endpoint

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
      --apihost string     Airy Core HTTP API endpoint
      --workspace string   workspace directory of an Airy core instance (default is the cwd)
```


***

## Config

Manages an Airy Core instance via airy.yaml

### Apply

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
      --apihost string     Airy Core HTTP API endpoint
      --workspace string   workspace directory of an Airy core instance (default is the cwd)
```


***

## Create

Creates an instance of Airy Core

#### Synopsis

Creates a workspace directory (default .) with default configuration and starts an Airy Core instance using the given provider

```
airy create [workspace directory] [flags]
```

#### Options

```
      --disable-tracking                 Disables sending events to Segment.
  -h, --help                             help for create
      --init-only                        Only create the airy workspace directory and exit.
      --namespace string                 (optional) Kubernetes namespace that Airy should be installed to. (default "default")
      --no-apply                         Don't apply any component configuration found in an existing airy.yaml file after creation.
      --provider string                  One of the supported providers (aws|minikube). (default "minikube")
      --provider-config stringToString   Additional configuration for the providers. (default [])
```

#### Options inherited from parent commands

```
      --apihost string     Airy Core HTTP API endpoint
      --workspace string   workspace directory of an Airy core instance (default is the cwd)
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
      --apihost string     Airy Core HTTP API endpoint
      --workspace string   workspace directory of an Airy core instance (default is the cwd)
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
      --apihost string     Airy Core HTTP API endpoint
      --workspace string   workspace directory of an Airy core instance (default is the cwd)
```


***

## Upgrade

Upgrades an instance of Airy Core

#### Synopsis

Upgrades an existing Airy Core instance, read from a workspace directory (default .)

```
airy upgrade [flags]
```

#### Options

```
      --approve          Upgrade automatically without asking for an approval (optional).
  -h, --help             help for upgrade
      --version string   Specify a version to upgrade to (optional).
```

#### Options inherited from parent commands

```
      --apihost string     Airy Core HTTP API endpoint
      --workspace string   workspace directory of an Airy core instance (default is the cwd)
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
      --apihost string     Airy Core HTTP API endpoint
      --workspace string   workspace directory of an Airy core instance (default is the cwd)
```


***

