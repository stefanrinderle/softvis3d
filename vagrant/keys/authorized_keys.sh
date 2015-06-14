#!/bin/sh
# copy authorized_keys from /home/vagrant to /root
# necessary so Ansible can connect as root without authentication

# use "run-once" pattern
MARKER="/var/vagrant_provision_authorized_keys"
if [ -f "$MARKER" ]; then
	echo "'authorized_keys' seems to be already installed, exiting!"
	exit 0
fi

AUTHORIZED_KEYS="/home/vagrant/.ssh/authorized_keys"
if [ ! -f "$AUTHORIZED_KEYS" ]; then
	echo "$AUTHORIZED_KEYS not available!"
	exit 1
fi

set -x

# use same key for user vagrant
mkdir -p /root/.ssh
cp $AUTHORIZED_KEYS /root/.ssh

touch $MARKER