# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.define "source", autostart: false do |source|
      source.vm.box = "{{.SourceBox}}"
  end

  config.vm.define "output" do |output|
    output.vm.box = "{{.BoxName}}"
  end

  config.vm.provider "virtualbox" do |vbox|
    vbox.cpus = 2
    vbox.memory = 4096
  end

  config.vm.synced_folder "../../", "/vagrant", disabled: false
  
end