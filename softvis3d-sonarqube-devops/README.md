# softvis3d-sonarqube-devops

Module used for automated integration tests for the softvis3d-sonarqube-plugin using docker and co.

## cheat sheet

protractor ./protractor.conf.js --baseUrl="http://localhost:8787/"

## cheat sheet

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