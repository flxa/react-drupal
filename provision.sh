#!/bin/bash

# Ensure we have directories.
sudo mkdir -p /vagrant/app/sites/default/files/tmp /private
sudo chown -R vagrant:vagrant /vagrant/app/sites/default/files /private
# The default version is 7.1.
# switch_php 5.6
# switch_php 7.0
# switch_php 7.1
