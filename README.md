# softvis3d-sonarqube-devops

## cheat sheet

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
