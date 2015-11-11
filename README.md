# softvis3d-sonarqube-devops

## cheat sheet

https://bildung.xarif.de/xwiki/bin/Articles/The+Marriage+of+Ansible+and+Docker

docker run -d --name sonarqube512 -p 9000:9000 -p 9092:9092 -e SONARQUBE_JDBC_USERNAME=sonar -e SONARQUBE_JDBC_PASSWORD=sonar -e SONARQUBE_JDBC_URL=jdbc:postgresql://localhost/sonar sonarqube:5.1.2

- show containers

docker ps --filter "status=exited"

- list running container

docker ps

- list running machines

docker-machine ls

- get ports of a container

docker port web

- start to work

docker-machine start default
docker-machine env default


——————————
install python and pip

eval "$(docker-machine env default)"

docker build -t "rinderle:testversion" . (im order des docker files)

---

Old rindernet setup

docker build -t "rinderle:testversion" .

apt-get install python-pip

for jenkins:

ansible-playbook -v -e="container_name=sonarContainer sonar_version='5.1.2'" site.yml

chmod 600 ./docker_ansible_client/keys/id_rsa
mkdir -p /tmp/ansibletemp
chmod 777 /tmp/ansibletemp

—————

Assert the container's desired state. 

"present" only asserts that the matching containers exist. 
"started" asserts that the matching containers both exist and are running, but takes no action if any configuration has changed. 
"reloaded" (added in Ansible 1.9) asserts that all matching containers are running and restarts any that have any images or configuration out of date. 
"restarted" unconditionally restarts (or starts) the matching containers. 
"stopped" and '"killed" stop and kill all matching containers. 
"absent" stops and then' removes any matching containers.
