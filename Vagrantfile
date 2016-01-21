Vagrant.configure(2) do |config|
  # ...
  #config.vm.box = "ubuntu/trusty64"
  config.vm.box = "scotch/box"
  config.vm.hostname = "scotchbox"
  #config.vm.provision "shell", path: "provision.sh"

  config.vm.provider :virtualbox do |vb|
    vb.customize [
      "modifyvm", :id,
      "--cpuexecutioncap", "50",
      "--memory", "256",
      "--natpf1", 'guesthttp,tcp,127.0.0.1,8080,,80',
      "--natpf1", 'guesthttps,tcp,127.0.0.1,4433,,443',
    ]
  end
end

#something
