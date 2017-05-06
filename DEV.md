# Development Environment

## Requirements
 * Java (JDK 8)
 * Maven (>= 3.3)
 * NodeJS
 * docker & docker-compose

When encountering any problems (or working on a windows environment) it is highly recommended to use the provided vagrant instance instead: `vagrant up`. <br />
_The necessary port 9000 will be forwarded from your host to the client machine._

## Setting up
 * `docker-compose up` will register an instance of SonarQube to `http://localhost:9000`
 * Initially the server is empty and a new project should be scanned: `mvn clean verify sonar:sonar`
 * For further instructions on the plugin's development follow the [softvis3d-frontend](./softvis3d-frontend/)
 * To build and deploy Softvis3D to your SonarQube docker container:
   ```
   mvn package -DskipTests
   CONTAINER_ID=`docker ps -q --filter "name=sonarqube" --filter "name=softvis" --filter "status=running"`
   docker cp sonar-softvis3d-plugin/target/sonar-softvis3d-plugin-*-SNAPSHOT.jar ${CONTAINER_ID}:/opt/sonarqube/extensions/downloads
   ```