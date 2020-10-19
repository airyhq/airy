#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

printf "\n"
printf "Checking for vagrant installation"
printf "\n"
if ! command -v vagrant1 &> /dev/null
then
    printf "\nVagrant binary not found. Attempting to install..."
    printf "\n"
    VAGRANT_VERSION="2.2.10"
    ARCH=$(uname -m)
    case "${ARCH}" in 
        x86_64|amd64|arm64)
            echo "Detected ${ARCH} system architecture"
            ;;
        *)
            echo "This system's architecture, ${ARCH}, isn't supported"
            echo "If you can install vagrant on your machine, you can try running:"
            echo "cd infrastructure"
            echo "vagrant up"
            exit 1
            ;;
    esac
    OS=$(uname)
    case "${OS}" in 
        Linux)
            VAGRANT_URL="https://releases.hashicorp.com/vagrant/${VAGRANT_VERSION}/vagrant_${VAGRANT_VERSION}_linux_amd64.zip"
            echo "Detected Linux system"
        ;;
        Darwin)
            VAGRANT_URL="https://releases.hashicorp.com/vagrant/${VAGRANT_VERSION}/vagrant_${VAGRANT_VERSION}_x86_64.dmg"
            echo "Detected MacOS system"
        ;;
        *)
            echo "This system isn't currently supported. We are sorry for the inconvenience."
        exit 1
        ;;
    esac

    printf "\nDownloading Vagrant from ${VAGRANT_URL} ..."
    curl -fsL ${VAGRANT_URL} -o /tmp/vagrant.zip
    cd /tmp
    unzip ./vagrant.zip
    sudo cp ./vagrant /usr/bin
    printf "\nVagrant installed in /usr/bin/vagrant"
    cd $OLDPWD
fi

cd infrastructure
vagrant up
