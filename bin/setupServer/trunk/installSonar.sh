#!/bin/sh

apt-get update
apt-get upgrade --force-yes
cd /opt/
#wget http://dist.sonar.codehaus.org/sonarqube-5.1.zip

apt-get install --force-yes openjdk-7-jdk git maven graphviz
git clone https://github.com/SonarSource/sonarqube.git
cd /opt/sonarqube/

./build.sh
#mvn sonar:sonar

#cp /target/sonar-softVis3D-plugin-0.2.8-SNAPSHOT.jar /opt/sonarqube-5.1/extensions/downloads/
#
#./sonarqube-5.1/bin/linux-x86-64/sonar.sh start
#tail -f sonarqube-5.1/logs/sonar.log
