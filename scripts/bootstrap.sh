#!/bin/bash
set -eo pipefail
IFS=$'\n\t'

if ! command -v vagrant &> /dev/null
then
    printf "\nVagrant binary not found. Attempting to install...\n"
    printf "\n"
    VAGRANT_VERSION="2.2.10"
    ARCH=$(uname -m)
    case "${ARCH}" in
        x86_64|amd64|arm64)
            printf "Detected ${ARCH} system architecture\n"
            ;;
        *)
            printf "This system's architecture, ${ARCH}, isn't supported\n"
            printf "If you can install vagrant on your machine, you can try running:\n\n"
            printf "cd infrastructure\n"
            printf "vagrant up\n"
            exit 1
            ;;
    esac
    OS=$(uname)
    case "${OS}" in
        Linux|linux)
            printf "Detected Linux system\n"
            VAGRANT_URL="https://releases.hashicorp.com/vagrant/${VAGRANT_VERSION}/vagrant_${VAGRANT_VERSION}_linux_amd64.zip"
            printf "Downloading Vagrant from ${VAGRANT_URL} ...\n"
            curl -fsL ${VAGRANT_URL} -o /tmp/vagrant.zip
            cd /tmp
            unzip ./vagrant.zip
            sudo mv ./vagrant /usr/local/bin
            cd $OLDPWD
        ;;
        Darwin)
            printf "Detected MacOS system\n"
            VAGRANT_URL="https://releases.hashicorp.com/vagrant/${VAGRANT_VERSION}/vagrant_${VAGRANT_VERSION}_x86_64.dmg"
            printf "Downloading Vagrant from ${VAGRANT_URL} ...\n"
            curl -fsL ${VAGRANT_URL} -o /tmp/vagrant.dmg
            VOLUME=`hdiutil attach /tmp/vagrant.dmg | grep Volumes | awk '{print $3}'`
            sudo installer -package /Volumes/Vagrant/vagrant.pkg  -target "/Volumes/Macintosh HD"
            hdiutil detach $VOLUME
        ;;
        *)
            printf "This system ${OS} isn't currently supported. We are sorry for the inconvenience.\n\n"
        exit 1
        ;;
    esac

    printf "Vagrant installed in "`which vagrant`"\n"
fi


cd infrastructure
vagrant up
