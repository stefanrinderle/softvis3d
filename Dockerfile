#
# softvis3d
# Copyright (C) 2020 Stefan Rinderle and Yvo Niedrich
# stefan@rinderle.info / yvo.niedrich@gmail.com
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU Lesser General Public
# License as published by the Free Software Foundation; either
# version 3 of the License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# Lesser General Public License for more details.
#
# You should have received a copy of the GNU Lesser General Public
# License along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
#

FROM sonarqube

# RUN apt-get update && apt-get install nodejs -y

RUN mv /opt/sonarqube/lib/bundled-plugins/*.jar /opt/sonarqube/extensions/plugins/

ENV TS_PLUGIN_VERSION 1.1.0
RUN cd /opt/sonarqube/extensions/plugins && \
	curl -sLo sonar-softvis3d-plugin-${TS_PLUGIN_VERSION}.jar \
    https://github.com/Pablissimo/SonarTsPlugin/releases/download/v${TS_PLUGIN_VERSION}/sonar-typescript-plugin-${TS_PLUGIN_VERSION}.jar
