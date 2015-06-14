#!/bin/sh
# installs vagrant public and private key

# use "run-once" pattern
MARKER="/var/vagrant_provision_vagrant_keys"
if [ -f "$MARKER" ]; then
	echo "'vagrant_keys' seems to be already installed, exiting!"
	exit 0
fi

set -x

# use vagrant insecure key for root
mkdir -p /root/.ssh
wget --no-check-certificate https://raw.githubusercontent.com/mitchellh/vagrant/master/keys/vagrant -O /root/.ssh/id_rsa
wget --no-check-certificate https://raw.githubusercontent.com/mitchellh/vagrant/master/keys/vagrant.pub -O /root/.ssh/id_rsa.pub
chmod 600 /root/.ssh/id_*

# use same key for user vagrant
cp /root/.ssh/id_rsa /home/vagrant/.ssh
cp /root/.ssh/id_rsa.pub /home/vagrant/.ssh
chown vagrant:vagrant /home/vagrant/.ssh/id_*

touch $MARKER