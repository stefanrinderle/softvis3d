# softvis3d-sonarqube-devops

Module used for automated integration tests for the softvis3d-sonarqube-plugin using vagrant, docker and co.

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

install python and pip

eval "$(docker-machine env default)"

docker build -t "sonarqube-rinderle:1.0" . (im order des docker files)

---

Setup image:

docker build -t "sonarqube-rinderle:1.0" .

apt-get install python-pip

for jenkins:

chmod 600 ./docker_ansible_client/keys/id_rsa
mkdir -p /tmp/ansibletemp
chmod 777 /tmp/ansibletemp

--------------
ansible-playbook testSonarStable.yml -i inventory -e="screenshot_base_path='/tmp/screenshots' sonar_version='4.5.6'"
