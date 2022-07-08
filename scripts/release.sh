#!/bin/bash

set -eo pipefail
IFS=$'\n\t'

if [ -z ${GITHUB_TOKEN+x} ]; then
  echo "GITHUB_TOKEN is not set. Exiting."
  exit 1
fi

start() {
    release_number=$1
    echo -e "Starting release ${release_number}\n"
    create_issue
    create_release_branch
    update_release_version
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
    command git checkout -b release/"${release_number}"
    command git push origin release/"${release_number}"
    echo -e "Created branch release/${release_number}\n"
}

changelog() {
    release_number=$1
    echo -e "Creating the release drafter for the changelog (version ${release_number})\n"
    create_release_drafter
}

create_release_drafter() {
    command git checkout release/"${release_number}"
    git pull origin release/"${release_number}"
    command git checkout -b changelog/"${release_number}"
    command git push origin changelog/"${release_number}"
    command git checkout release/"${release_number}"
}

finish() {
    release_number=$1
    rename_draft_release
    commit_changelog
    echo -e "Finishing release ${release_number}\n"
    merge_main
    merge_develop
    echo -e "Release ${release_number} is finished\n"
    create_alpha_version
}

update_release_version() {
    issue_number=$(command curl -s -H "Accept: application/vnd.github.v3+json" \
        "https://api.github.com/repos/airyhq/airy/issues?labels=release" | jq '.[0].number')
    command echo "${release_number}" >VERSION
    echo -e "Updated VERSION file\n"
}

commit_version() {
    # shellcheck disable=SC1091
    command git add VERSION
    command git commit -m "Fixes #${issue_number}"
    command git push origin release/"${release_number}"
    echo -e "Updated VERSION\n"
}

commit_changelog() {
    # shellcheck disable=SC1091
    source scripts/changelog_md.sh "${release_number}"
    command git add docs/docs/changelog.md
    command git commit -m "Update changelog #${issue_number}"
    command git push origin release/"${release_number}"
    echo -e "Updated changelog.md\n"
}

create_alpha_version() {
    regex="([0-9]+).([0-9]+).([0-9]+)"
    if [[ $release_number =~ $regex ]]; then
        major="${BASH_REMATCH[1]}"
        minor="${BASH_REMATCH[2]}"
        patch="${BASH_REMATCH[3]}"
    fi
    alpha_version=$(printf "%s.%s.%s-alpha\n" "$major" $((minor + 1)) "$patch")
    command echo "${alpha_version}" >VERSION
    command git add VERSION
    command git commit -m "Bump version to ${alpha_version}"
    command git push origin develop
    echo -e "Updated VERSION file to ${alpha_version}\n"
}

merge_main() {
    command git checkout main
    command git pull origin main
    command git merge --no-ff release/"${release_number}"
    command git tag "${release_number}"
    command git push origin main
    command git push origin "${release_number}"
    echo -e "Successfully merged into main branch\n"
}

merge_develop() {
    command git checkout develop
    command git pull origin develop
    command git merge --no-ff release/"${release_number}"
    command git push origin develop
    echo -e "Successfully merged into develop branch\n"
}

rename_draft_release() {
    release_id=$(
        command curl -s -H "Authorization: token ${GITHUB_TOKEN}" -X GET \
            https://api.github.com/repos/airyhq/airy/releases | jq '.[0].id'
    )
    command curl -s -H "Authorization: token ${GITHUB_TOKEN}" -X PATCH \
        https://api.github.com/repos/airyhq/airy/releases/"$release_id" \
        -d "{\"name\":\"${release_number}\", \"tag_name\":\"${release_number}\"}" > /dev/null
}

if [[ -z ${1+x} || -z ${2+x} ]]; then
    echo -ne "Error executing script\n"
    echo -ne "Expected syntax: release.sh <start | finish> <version_number>\n"
    exit 1
fi

case $1 in
"start")
    start "$2"
    ;;
"changelog")
    changelog "$2"
    ;;
"finish")
    finish "$2"
    ;;
esac
