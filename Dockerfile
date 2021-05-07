### BUILD image
FROM maven:3-jdk-11
# create app folder for sources
RUN mkdir -p /build
WORKDIR /build
RUN git clone https://github.com/AdamBien/breakr.git

WORKDIR /build/breakr/breakr

ARG SQ_HOST
ENV ENV_SQ_HOST=$SQ_HOST

ARG SQ_PORT
ENV ENV_SQ_PORT=$SQ_PORT

RUN mvn -U -B package sonar:sonar -Dsonar.host.url=http://$SQ_HOST:$SQ_PORT -Dsonar.login=admin -Dsonar.password=admin