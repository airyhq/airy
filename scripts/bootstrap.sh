#!/bin/bash
set -eo pipefail
IFS=$'\n\t'

ARCH=$(uname -m)
OS=$(uname)
SCRIPT_PATH=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

infra_path=""
infra_path+=$( dirname $SCRIPT_PATH )
infra_path+="/infrastructure"

if ! command -v vagrant &> /dev/null
then
    printf "\nVagrant binary not found. Attempting to install...\n"
    VAGRANT_VERSION="2.2.10"
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

read -p "Do you want to add the vagrant box to the host file so you can access it under api.airy [yn]? " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]];
then
    vagrant plugin install vagrant-hostsupdater --plugin-clean-sources --plugin-source https://gems.ruby-china.com
fi

if ! command -v VBoxManage &> /dev/null
then
    printf "\nVirtualbox binary not found. Attempting to install...\n"
    VIRTUALBOX_VERSION="2.2.10"
    case "${ARCH}" in
        x86_64|amd64|arm64)
            printf "Detected ${ARCH} system architecture\n"
            ;;
        *)
            printf "This system's architecture, ${ARCH}, isn't supported\n"
            printf "If you can install VirtualBox on your machine, you can try running:\n\n"
            printf "cd infrastructure\n"
            printf "vagrant up\n"
            exit 1
            ;;
    esac
    case "${OS}" in
        Linux|linux)
            printf "Detected Linux system\n"
            declare -A osInfo;
            osInfo[/etc/debian_version]="sudo apt-get -y install"
            osInfo[/etc/alpine-release]="sudo apk --update add"
            osInfo[/etc/centos-release]="sudo yum -y install"
            osInfo[/etc/fedora-release]="sudo dnf -y install"
            package_manager=""
            for f in ${!osInfo[@]}
            do
                if [[ -f $f ]];then
                    package_manager=${osInfo[$f]}
                fi
            done
            if [ -z ${package_manager} ];then
                printf "Package manager couldn't be identified.\n"
                printf "Currently only Debian-based, Alpine Centos and Fedora systems are supported.\n"
                printf "We are sorry for the inconvenience.\n\n"
                exit 1
            fi
            printf "Trying to install VirtualBox with a package manager ...\n"
            eval "${package_manager}" virtualbox
        ;;
        Darwin)
            printf "Detected MacOS system\n"
            VIRTUALBOX_URL="https://download.virtualbox.org/virtualbox/6.1.16/VirtualBox-6.1.16-140961-OSX.dmg"
            printf "Downloading VirtualBox from ${VAGRANT_URL} ...\n"
            curl -fsL ${VIRTUALBOX_URL} -o /tmp/virtualbox.dmg
            VOLUME=`hdiutil attach /tmp/virtualbox.dmg | grep Volumes | awk '{print $3}'`
            sudo installer -package /Volumes/Virtualbox/virtualbox.pkg  -target "/Volumes/Macintosh HD"
            hdiutil detach $VOLUME
        ;;
        *)
            printf "This system ${OS} isn't currently supported. We are sorry for the inconvenience.\n\n"
            exit 1
        ;;
    esac

    printf "Virtualbox installed in "`which VBoxManage`"\n"
fi


cd $infra_path
vagrant destroy -f

if [ -z ${AIRY_VERSION+x} ]; then
    branch_name="$(git symbolic-ref HEAD 2>/dev/null)" ||
    branch_name="(unnamed branch)"     # detached HEAD

    branch_name=${branch_name##refs/heads/}
    case "$branch_name" in
        develop )
            AIRY_VERSION=beta
            ;;
        release* )
            AIRY_VERSION=release
            ;;
        * )
            AIRY_VERSION=latest
            ;;
    esac
fi

AIRY_VERSION=${AIRY_VERSION} vagrant up
