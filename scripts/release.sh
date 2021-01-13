#!/bin/bash

set -eo pipefail
IFS=$'\n\t'

start() {
    release_number=$1
    echo -e "Starting release ${release_number}\n"
    create_issue
    create_release_branch
    increase_version
    commit_version
}

create_issue() {
    issue_number=$(command curl -s \
        -X POST \
        -H "Accept: application/json" \
        -H "Authorization: token ${GITHUB_TOKEN}" \
        https://api.github.com/repos/airyhq/airy/issues \
        -d "{\"title\":\"Release ${release_number}\", \"labels\": [\"release\"]}" | jq '.number')
    echo -e "Created issue number ${issue_number} on Github\n"
}

create_release_branch() {
    command git checkout develop
    command git pull origin develop
    command git checkout -b release/${release_number}
    command git push origin release/${release_number}
    echo -e "Created branch release/${release_number}\n"
}

finish() {
    release_number=$1
    echo -e "Finishing release ${release_number}\n"
    merge_main
    merge_develop
    echo -e "Release ${release_number} is finished\n"
}

increase_version() {
    issue_number=$(curl -s\
                       -H "Accept: application/vnd.github.v3+json" \
                       "https://api.github.com/repos/airyhq/airy/issues?labels=release" | jq '.[0].number')
    command echo ${release_number}> VERSION
    echo -e "Updated VERSION file\n"
}

commit_version() {
    command git add VERSION
    command git commit -m "Fixes #${issue_number}"
    command git push origin release/${release_number}
    echo -e "Updated VERSION file\n"
}

merge_main() {
    command git checkout main
    command git pull origin main
    command git merge --no-ff release/${release_number}
    command git tag ${release_number}
    command git push origin main
    command git push origin ${release_number}
    echo -e "Successfully merged into main branch\n"
}

merge_develop() {
    command git checkout develop
    command git pull origin develop
    command git merge --no-ff release/${release_number}
    command git push origin develop
    echo -e "Successfully merged into develop branch\n"
}

if [[ -z ${1+x} || -z ${2+x} ]]; then
    echo -ne "Error executing script\n"
    echo -ne "Expected syntax: release.sh <start | finish> <version_number>\n"
    exit 1
fi

case $1 in
    "start")
        start $2
        ;;
    "finish")
        finish $2
esac

