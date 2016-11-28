Vagrant.configure("2") do |config|
  config.vm.define 'lamp', primary: true do |lamp|
    lamp.vm.box      = 'pnx/lamp70'
    lamp.vm.hostname = '{{ app_name }}.dev'

    # This script is a last chance for Developers to add more
    # configuration to the Vagrant host.
    #
    # Examples:
    #  * Create files directories
    #  * Setup additional databases
    # lamp.vm.provision :shell, path: "provision.sh"
    #
    # Modify the host resources.
    # lamp.vm.provider :virtualbox do |vb|
    #   vb.customize [ "modifyvm", :id, "--cpus",   "2" ]
    #   vb.customize [ "modifyvm", :id, "--memory", "2048" ]
    # end
  end
end
