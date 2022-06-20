---
title: Website installation
sidebar_label: Installation
---

To install the Chat Plugin UI on your website add the following script tag to
the `<head>` section:

```html
<script>
  (function (w, d, s, n) {
    w[n] = w[n] || {};
    w[n].channelId = "CHANNEL_ID";
    w[n].host = "SCRIPT_HOST";
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s);
    j.async = true;
    j.src = w[n].host + "/chatplugin/ui/s.js";
    f.parentNode.insertBefore(j, f);
  })(window, document, "script", "airy");
</script>
```

You must replace `CHANNEL_ID` with the channel ID obtained when
[connecting](#connecting-a-channel) the source and `SCRIPT_HOST` with the host
of your Chat Plugin server. When using the local minikube environment
`SCRIPT_HOST` must be set to `localhost`.

:::note

`localhost` is not publicly accessible. The setup will only work for local web pages.

:::

To test the setup, replace the `CHANNEL_ID` in the URL
`http://localhost/chatplugin/ui/example?channel_id=CHANNEL_ID` and open it in your
browser.
