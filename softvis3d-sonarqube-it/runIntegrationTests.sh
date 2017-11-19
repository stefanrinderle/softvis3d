#!/bin/bash

# example call "./runIntegrationTests.sh 5.6 sonar-softvis3d-plugin-0.5.3-SNAPSHOT.jar"

SONARQUBE_VERSION=$1
PLUGIN_FILENAME=$2

SONARQUBE_LOCAL_PORT=8787

CONTAINER_BASE_NAME=sonarqube_integration_test
CONTAINER_NAME=${CONTAINER_BASE_NAME}_${SONARQUBE_VERSION}
CONTAINER_IDENTIFIER=softvis3d/${CONTAINER_BASE_NAME}:${SONARQUBE_VERSION}
TMP_DOCKERFILE_DIR=./sonarqube/tmp/

# cleanup
echo "Cleanup"
docker stop ${CONTAINER_NAME}
docker rm ${CONTAINER_NAME}
rm -rf ${TMP_DOCKERFILE_DIR}

# create new sonarqube image with plugin installed
mkdir ${TMP_DOCKERFILE_DIR}
cp ../sonar-softvis3d-plugin/target/${PLUGIN_FILENAME} ${TMP_DOCKERFILE_DIR}
cp ./sonarqube/Dockerfile ${TMP_DOCKERFILE_DIR}/Dockerfile
sed -i -e "s/XX_SONARQUBE_VERSION_XX/${SONARQUBE_VERSION}/g" ${TMP_DOCKERFILE_DIR}/Dockerfile
sed -i -e "s/XX_PLUGIN_FILENAME_XX/${PLUGIN_FILENAME}/g" ${TMP_DOCKERFILE_DIR}/Dockerfile

docker build -t ${CONTAINER_IDENTIFIER} ${TMP_DOCKERFILE_DIR} --pull

dockerid=$(docker run -d --name ${CONTAINER_NAME} -p ${SONARQUBE_LOCAL_PORT}:9000 ${CONTAINER_IDENTIFIER})

echo "Run integration test container $CONTAINER_NAME with id $dockerid and wait 180 seconds"
sleep 180

echo "Analyse project"
mvn -f ../pom.xml -U -B -Pci clean install sonar:sonar -Dsonar.host.url=http://localhost:${SONARQUBE_LOCAL_PORT}

sleep 15

echo "Run integration tests"

docker stop softvis3d_protractor_runner
docker rm softvis3d_protractor_runner

echo "npm install & build integration test container"
cd protractor
npm install
cd ..

docker build -t softvis3d_protractor_runner ./protractor --pull
docker run --name ${CONTAINER_NAME}_protractorTestRun -i --privileged --rm --net=host  -v /dev/shm:/dev/shm -v $(pwd)/protractor:/protractor softvis3d_protractor_runner  ./protractor.conf.js --baseUrl="http://localhost:${SONARQUBE_LOCAL_PORT}/"

echo "Stop and cleanup of containers and images"

docker stop ${CONTAINER_NAME}_protractorTestRun
docker rm ${CONTAINER_NAME}_protractorTestRun

docker stop ${dockerid}
docker rm ${dockerid}

if docker images -f "dangling=true" -q
then
    echo "nothing to do"
else
    docker rmi $(docker images -f "dangling=true" -q)
    echo "removed"
fi