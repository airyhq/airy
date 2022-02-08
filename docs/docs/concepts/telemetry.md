---
title: Telemetry
sidebar_label: Telemetry
---

## Usage Statistics

Help Airy improve its products by sending anonymous data collected about the
basic usage of the Airy platform and the hardware on which it is run.
Please note that this will not include personal data
or any sensitive information. The data sent complies with the [Airy Privacy
Policy](https://airy.co/privacy-policy).
Of course it is possible to opt out of this. Just add `--disable-tracking` when
creating an Airy core Instance like described
[here](https://airy.co/docs/core/cli/usage#options-2) or the following to the
airy.yaml before applying the configuration like described
[here](https://airy.co/docs/core/getting-started/installation/configuration#applying-the-configuration).

```
tools:
  segment:
    enabled: false
```

## Segment

The [Segment Track](https://segment.com/docs/connections/spec/track/) function
helps us to record actions that users are doing on our platform and send them to
our backend. We are exclusively tracking the following events.

### Events

- installation_started

This event is sent when an Airy instance is created with the [Airy
CLI](https://airy.co/docs/core/cli/introduction)

```
{
    provider: "<provider>",
    numcpu: "<count>"
}
```

- channel_connected

Tracking the channel connections helps us understand which sources are most
important to our users.

```
{
    channel: "<type>"
}
```
