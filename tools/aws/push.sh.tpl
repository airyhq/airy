#!/bin/bash

set -ex

AWS="%{tool_path}"
BUCKET_NAME="%{bucket_name}"
DISTRIBUTION_ID="%{distribution_id}"
BUNDLE="%{source_directory}"
FILES="%{files}"
TARGET_PATH="%{path}"
DRY_RUN="%{dry_run}"

if [[ -z "$AWS" ]]; then
    echo >&2 "error: aws cli not found; Pls install https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html"
    exit 1
fi

mkdir -p $BUNDLE

for i in $(echo $FILES | sed "s/,/ /g")
do
    cp -r $i $BUNDLE/
done

echo "Deploying:"
ls $BUNDLE/

aws s3 sync $DRY_RUN $BUNDLE/ "s3://${BUCKET_NAME}${TARGET_PATH}"

if test -f "$BUNDLE/index.html"; then
    aws s3 cp $DRY_RUN $BUNDLE/index.html "s3://${BUCKET_NAME}${TARGET_PATH}index.html" --cache-control "public, max-age=0"
fi


if [ -n "$DISTRIBUTION_ID" ]; then
    if [ -z "$DRY_RUN" ]; then
        aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths '/*'
    else
        echo "dry run: aws cloudfront create-invalidation"
    fi
fi
