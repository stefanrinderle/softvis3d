#!/bin/sh

apt-get update
apt-get upgrade --force-yes
apt-get install --force-yes unzip openjdk-7-jdk git maven graphviz

cd /opt
wget http://dist.sonar.codehaus.org/sonarqube-4.5.4.zip

unzip sonarqube-4.5.4.zip

wget http://repo1.maven.org/maven2/org/codehaus/sonar/runner/sonar-runner-dist/2.4/sonar-runner-dist-2.4.zip
unzip sonar-runner-dist-2.4.zip

cp /target/sonar-softVis3D-plugin-0.2.7-SNAPSHOT.jar /opt/sonarqube-4.5.4/extensions/downloads/

./sonarqube-4.5.4/bin/linux-x86-64/sonar.sh start
tail -f sonarqube-4.5.4/logs/sonar.log
