#
# SoftVis3D Sonar plugin
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

### BUILD image
FROM maven:3-jdk-11

RUN mkdir -p /build
WORKDIR /build
ADD breakr.tar /build/

WORKDIR /build/breakr

ENTRYPOINT mvn -U -B package sonar:sonar -Dsonar.host.url=http://$SQ_HOST:$SQ_PORT -Dsonar.login=admin -Dsonar.password=admin -Dsonar.scm.disabled=true