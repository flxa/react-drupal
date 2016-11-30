#!/bin/bash

# Ensure we have directories.
sudo mkdir -p /vagrant/app/sites/default/files/tmp /private
sudo chown -R vagrant:vagrant /vagrant/app/sites/default/files /private
