global:
  appImageTag: latest
  containerRegistry: ghcr.io/airyhq
apps:
  sources:
    facebook:
      appId: "changemeappid"
      appSecret: "changemesecret"
      webhookSecret: "changeme"
    google:
      partnerKey: "changeme"
      saFile: >
        '{"type":"service_account","project_id":"airy","private_key_id":"no","private_key":"nokey","client_email":"no","client_id":"no","auth_uri":"no","token_uri":"no","no":"no","client_x509_cert_url":"no"}'
    twilio:
      authToken: "changeme"
      accountSid: "changeme"
  api:
    mailFrom: "changeme"
    mailPort: 587
    mailUrl: "changeme"
    mailUsername: "changeme"
    mailPassword: "changeme"
