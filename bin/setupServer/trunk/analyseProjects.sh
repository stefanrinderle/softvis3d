#!/bin/sh

cd /opt/sonarqube/

./stop.sh
git pull

./quick-build.sh

cp /target/sonar-softVis3D-plugin-0.2.7-SNAPSHOT.jar /opt/sonarqube/sonar-application/target/sonarqube-5.2-SNAPSHOT/extensions/downloads/

./start.sh

sleep 1m

mvn sonar:sonar

if [ -d "/opt/sonar-examples/" ]
then
    echo "Directory /opt/sonar-examples/ exists."
    cd /opt/sonar-examples/
    git pull
else
    cd /opt/
    git clone https://github.com/SonarSource/sonar-examples.git
fi

cd /opt/sonar-examples/projects/languages/java/maven/java-maven-simple
mvn clean install
mvn sonar:sonar

cd /opt/sonar-examples/projects/languages/java/sonar-runner/java-sonar-runner-simple
/opt/sonar-runner-2.4/bin/sonar-runner 

cd /opt/sonar-examples/projects/languages/java/code-coverage/combined\ ut-it/combined-ut-it-multimodule-maven-jacoco
mvn clean install
mvn sonar:sonar

cd /opt/sonar-examples/projects/multi-module/sonar-runner/java-sonar-runner-modules-different-structures
/opt/sonar-runner-2.4/bin/sonar-runner 

cd /opt/sonar-examples/projects/multi-module/sonar-runner/java-sonar-runner-modules-own-configuration-file
/opt/sonar-runner-2.4/bin/sonar-runner 

cd /opt/sonar-examples/projects/multi-module/sonar-runner/java-sonar-runner-modules-same-structure
/opt/sonar-runner-2.4/bin/sonar-runner