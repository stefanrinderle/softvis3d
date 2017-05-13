FROM sonarqube

# RUN apt-get update && apt-get install nodejs -y

RUN mv /opt/sonarqube/lib/bundled-plugins/*.jar /opt/sonarqube/extensions/plugins/

ENV SOFTVIS_PLUGIN_VERSION 0.9.0
RUN cd /opt/sonarqube/extensions/plugins && \
	curl -sLo sonar-softvis3d-plugin-${SOFTVIS_PLUGIN_VERSION}.jar \
    https://github.com/stefanrinderle/softvis3d/releases/download/softvis3d-${SOFTVIS_PLUGIN_VERSION}/sonar-softvis3d-plugin-${SOFTVIS_PLUGIN_VERSION}.jar

ENV TS_PLUGIN_VERSION 1.1.0
RUN cd /opt/sonarqube/extensions/plugins && \
	curl -sLo sonar-softvis3d-plugin-${TS_PLUGIN_VERSION}.jar \
    https://github.com/Pablissimo/SonarTsPlugin/releases/download/v${TS_PLUGIN_VERSION}/sonar-typescript-plugin-${TS_PLUGIN_VERSION}.jar
