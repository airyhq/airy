#!/bin/bash

start() {
    release_number=$1
    echo -e "Starting release ${release_number}"
    create_issue
    create_release_branch
}

create_issue() {
    command curl -s \
        -X POST \
        -H "Accept: application/json" \
        -H "Authorization: token ${GITHUB_TOKEN}" \
        https://api.github.com/repos/airyhq/airy/issues \
        -d "{\"title\":\"Release ${release_number}\", \"labels\": [\"release\"]}" | jq '.number'
}

create_release_branch() {
    command git checkout develop
    command git pull origin develop
    command git checkout -b release/${release_number}
}

finish() {
    release_number=$1
    echo -e "Finishing release ${release_number}"
    increase_version
    commit_version
    merge_main
    merge_develop
}

increase_version() {
    issue_number=$(curl -s\
                       -H "Accept: application/vnd.github.v3+json" \
                       "https://api.github.com/repos/airyhq/airy/issues?labels=release" | jq '.[0].number')
    command echo ${release_number}> VERSION
}

commit_version() {
    command git add VERSION
    command git commit -m "Fixes #${issue_number}"
    command git push origin release/${release_number}
}

merge_main() {
    command git checkout main
    command git pull origin main
    command git merge --no-ff release/${release_number}
    command git tag ${release_number}
    command git push origin main
    command git push origin ${release_number}
}

merge_develop() {
    command git checkout develop
    command git pull origin develop
    command git merge --no-ff release/${release_number}
    command git push origin develop
}

case $1 in

    "start")
        start $2
        ;;
    "finish")
        finish $2
esac

