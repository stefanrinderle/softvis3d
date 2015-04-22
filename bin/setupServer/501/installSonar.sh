#!/bin/sh

apt-get update
apt-get upgrade
cd /opt/
wget http://dist.sonar.codehaus.org/sonarqube-5.0.1.zip

apt-get install --force-yes unzip openjdk-7-jdk git maven graphviz
unzip sonarqube-5.0.1.zip -d sonarqube

wget http://repo1.maven.org/maven2/org/codehaus/sonar/runner/sonar-runner-dist/2.4/sonar-runner-dist-2.4.zip
unzip sonar-runner-dist-2.4.zip 

cp /target/sonar-softVis3D-plugin-0.2.7-SNAPSHOT.jar /opt/sonarqube-5.0.1/extensions/downloads/

./sonarqube-5.0.1/bin/linux-x86-64/sonar.sh start
tail -f sonarqube-5.0.1/logs/sonar.log
