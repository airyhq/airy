# Airy Chat Plugin

This project hosts the frontend of the [Airy Live Chat Plugin](https://airy.co/docs/core/sources/chatplugin/overview) source. 

- `lib/`

Chat Plugin source code and npm library deployment.

- `image/`  

Builds an image with a bundle that will bootstrap the Chat Plugin using the user's script tag installation.
            
- `dev/`

Contains entrypoint for local development. Run:

```shell script
./scripts/web-dev.sh //frontend/chat-plugin/dev:bundle_server 
```

- `handles`

Cypress css tags.


## License

Apache 2.0 © [Airy, Inc.](https://airy.co)
