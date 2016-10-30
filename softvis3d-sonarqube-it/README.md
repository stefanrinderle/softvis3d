# softvis3d-sonarqube-it

Module used for automated integration tests for the softvis3d-sonarqube-plugin using docker and co.

## Process

* Create sonarqube container with plugin version deployed
* Analyse the current plugin source code
* Create protractor container and run tests
* Stop and close everything

## run integration tests
./runIntegrationTests.sh [SQ_VERSION] [PLUGIN_VERSION]
./runIntegrationTests.sh 6.1 sonar-softvis3d-plugin-0.7.0-SNAPSHOT.jar


## run local

protractor ./protractor.conf.js --baseUrl="http://localhost:8787/"

## cheat sheet docker

- show all containers

docker ps --filter "status=exited"

- list running machines

docker-machine ls

- get ports of a container

docker port web

- start to work

docker-machine start default
docker-machine env default
eval "$(docker-machine env default)"

——————————