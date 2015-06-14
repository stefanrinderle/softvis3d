#!/bin/sh
# installs latest version of Ansible

# use "run-once" pattern
if [ -f "/var/vagrant_provision_ansible" ]; then
	echo "'ansible' seems to be already installed, exiting!"
	exit 0
fi

set -x

# 1st use the latest release setup
apt-get install ansible #|| echo "failure -exiting"; exit 1 
#apt-get remove ansible

# ugly, ugly - but need to downgrade
#cd /tmp
#wget http://releases.ansible.com/ansible/ansible-1.6.6.tar.gz
#tar -xvf ansible-1.6.6.tar.gz 
#cd ansible-1.6.6
#python setup.py install

#RESULT=`ansible --version`
#echo $?
#echo $RESULT

#if [ "$RESULT" != "ansible 1.6.6" ]; then
#    exit 1
#fi 

#touch /var/vagrant_provision_ansible