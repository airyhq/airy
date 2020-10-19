#!/bin/bash
set -eo pipefail
IFS=$'\n\t'

if [[ -z "${FB_APP_ID}" ]]; then
  echo Please enter your Facebook app id
  read fb_app_id
else
  fb_app_id="${FB_APP_ID}"
fi

sed -i '.bak' "s/<fb_app_id>/$fb_app_id/" infrastructure/deployments/sources-facebook-events-router.yaml
sed -i '.bak' "s/<fb_app_id>/$fb_app_id/" infrastructure/deployments/api-admin.yaml

if [[ -z "${FB_APP_SECRET}" ]]; then
  echo Please enter your Facebook app secret
  read fb_app_secret
else
  fb_app_secret="${FB_APP_SECRET}"
fi

sed -i  '.bak' "s/<fb_app_secret>/$fb_app_secret/" infrastructure/deployments/api-admin.yaml

if [[ -z "${FB_WEBHOOK_SECRET}" ]]; then
  echo Please enter your Facebook webhook secret
  read fb_webhook_secret
else
  fb_webhook_secret="${FB_WEBHOOK_SECRET}"
fi

sed -i '.bak' "s/<fb_webhook_secret>/$fb_webhook_secret/" infrastructure/deployments/sources-facebook-webhook.yaml


cd infrastructure
vagrant up
