---
title: Security
sidebar_label: Security
---

## API Security

By default, authentication is disabled. There are two ways of protecting resources from unauthorized access.
You can set `security.systemToken` in the [cluster configuration](getting-started/installation/configuration.md) to a secure secret value in your `airy.yaml` and apply it. Once that is done you authenticate by setting the token as a value on the [Bearer Authorization header](https://tools.ietf.org/html/rfc6750#section-2.1) when making requests.

Apart from the `systemToken` you would also need to set your `system.allowedOrigins` value, for protecting the hostname from which API calls can be made:

```yaml
security:
  allowedOrigins: "my.airy.hostname.com"
  systemToken: "my-token-for-the-api"
  jwtSecret: "generated-secret-during-installation"
```

After you apply this configuration, you can query the API with the appropriate systemToken:

```sh
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer my-token-for-the-api" http://airy.core/conversations.list

```

:::note
Both the `systemToken` and the `jwtSecret` need to be set in the `airy.yaml` file for the API security to work properly. If one of the values is omitted, the API will not be protected.
To use the `airy` CLI, you also need to add the `systemToken` to the `cli.yaml` file.
:::

## Configuring OIDC

Setting up the `systemToken` will secure the API, but it means that UI clients will no longer work since API keys are not meant for web authentication. This is why Airy Core also supports [Open Id Connect (OIDC)](https://openid.net/connect/) to allow your agents to authenticate via an external provider. If you configure this in addition to the system token then both types of authentication will work when requesting APIs.

OIDC is an authentication layer on top of the popular OAuth 2.0 authorization framework. With the added information of
"who" made a request (authentication) Airy Core is able to offer audit and workflow features.

### GitHub

The easiest way to configure our OIDC is by using our GitHub preset. We will explain how to configure any OIDC provider further below. To get started you first need a GitHub OAuth app. You can follow [this guide](https://docs.github.com/en/developers/apps/creating-an-oauth-app) and as an Authorization Callback URL you need to put your Airy host with the
path `/login/oauth2/code/github`. So if your Airy Core instance is hosted at `https://airy.example.org` the Callback URL
would be `https://airy.example.org/login/oauth2/code/github`

:::note

You can always get your Airy host by running the CLI command `airy api endpoint`

:::

Now you can add your GitHub app configuration to the security section in your `airy.yaml`:

```yaml
security:
  oidc:
    allowedEmailPatterns: "*@airy.co,grace@example.org"
    provider: "github"
    clientId: "github oauth client id"
    clientSecret: "github oauth client secret"
```

Since you don't want just any GitHub user to be able to access your Airy Core instance you are also required to add
a list of emails or email wildcard patterns to define which users are authorized for use.

Once this configuration is applied all new requests to the Airy Core API will be redirected to the Github
provider for login. If that login is successful the Airy Core platform will set a http only authentication cookie
that will authenticate the current user session.

### Any open id provider

To configure any open id connect provider for authentication we expose the following configuration values:

```yaml
security:
  oidc:
    allowedEmailPatterns: "grace@example.org"
    provider: "my-provider"
    clientId: "client-id"
    clientSecret: "client-secret"
    logoutSuccessUrl: "http://example.org/login" # Optional url to redirect to when logged out
    scope: "openid,email" # comma separated list of scopes. Must include "openid"
    clientAuthenticationMethod: "basic" # One of [basic,post,none]
    authorizationGrantType: "authorization_code" # One of [authorization_code,implicit,refresh_token,client_credentials,password]
    authorizationUri: "https://my-provider.org/oauth2/v1/authorize"
    tokenUri: "https://my-provider.org/oauth2/v1/token"
    userInfoUri: "https://my-provider.org/oauth2/v1/userinfo"
    userInfoAuthenticationMethod: "form" # One of [header,form,query]
    userNameAttributeName: "id" # Field name within the OIDC identity token that uniquely identifies the user
    issuerUri: "https://my-provider.org/jwt-issuer"
    jwkSetUri: "https://my-provider.org/oauth2/v1/certs"
```

The redirect Uri to configure with your provider will always be of the form `{airy core host}/login/oauth2/code/{provider name}`.

## HTTPS

By default the deployed ingress resources don't have HTTPS enabled, so this needs to be configured depending on the provider where you are running `Airy Core`.

We advise you to refer to the documentation of your cloud provider on how to enable HTTPS on the LoadBalancer which routes to the installed ingress controller.
