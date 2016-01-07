Vagrant.configure(2) do |config|
  # ...
  config.vm.box = "ubuntu/trusty64"
  config.vm.hostname = "myprecise.box"

  config.vm.provider :virtualbox do |vb|
    vb.customize [
      "modifyvm", :id,
      "--cpuexecutioncap", "50",
      "--memory", "256",
    ]
  end
end
