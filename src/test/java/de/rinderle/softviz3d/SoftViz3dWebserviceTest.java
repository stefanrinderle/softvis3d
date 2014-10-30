/*
 * SoftViz3d Sonar plugin
 * Copyright (C) 2013 Stefan Rinderle
 * stefan@rinderle.info
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
 */
package de.rinderle.softviz3d;

import org.junit.Test;
import org.sonar.api.database.DatabaseSession;
import org.sonar.api.server.ws.WebService;
import org.sonar.api.server.ws.WsTester;

import static org.fest.assertions.Assertions.assertThat;

public class SoftViz3dWebserviceTest {
  private DatabaseSession session;
  private WebService ws = new SoftViz3dWebservice(session);

  @Test
  public void shouldDefineSoftviz3Webservice() throws Exception {
    // WsTester is available in the Maven artifact org.codehaus.sonar:sonar-plugin-api
    // with type "test-jar"
    WsTester tester = new WsTester(ws);
    WebService.Controller controller = tester.controller("api/softViz3d");

    assertThat(controller).isNotNull();
    assertThat(controller.path()).isEqualTo("api/softViz3d");
    assertThat(controller.description()).isNotEmpty();
    assertThat(controller.actions()).hasSize(1);

    WebService.Action initialize = controller.action("initialize");
    assertThat(initialize).isNotNull();
    assertThat(initialize.key()).isEqualTo("initialize");
  }
}
