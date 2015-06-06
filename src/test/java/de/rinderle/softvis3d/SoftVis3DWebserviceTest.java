/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
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
package de.rinderle.softvis3d;

import org.junit.Before;
import org.junit.Test;
import org.sonar.api.config.Settings;
import org.sonar.api.database.DatabaseSession;
import org.sonar.api.server.ws.WebService;
import org.sonar.api.server.ws.WsTester;

import static org.fest.assertions.Assertions.assertThat;

public class SoftVis3DWebserviceTest {

  private WebService.Controller controller;

  @Before
  public void setUp() {
    final DatabaseSession session = null;
    final Settings settings = null;
    final WebService ws = new SoftVis3DWebservice(session, settings);

    // WsTester is available in the Maven artifact
    // org.codehaus.sonar:sonar-plugin-api
    // with type "test-jar"
    final WsTester tester = new WsTester(ws);
    controller = tester.controller("api/softVis3D");
  }

  @Test
  public void testController() throws Exception {
    assertThat(controller).isNotNull();
    assertThat(controller.path()).isEqualTo("api/softVis3D");
    assertThat(controller.description()).isNotEmpty();
    assertThat(controller.actions()).hasSize(2);
  }

  @Test
  public void testVisualizationWebservice() throws Exception {
    final WebService.Action getTree = controller.action("getVisualization");
    assertThat(getTree).isNotNull();
    assertThat(getTree.key()).isEqualTo("getVisualization");
    assertThat(getTree.params()).hasSize(4);
  }

  @Test
  public void testConfigWebservice() throws Exception {
    final WebService.Action getTree = controller.action("getConfig");
    assertThat(getTree).isNotNull();
    assertThat(getTree.key()).isEqualTo("getConfig");
    assertThat(getTree.params()).hasSize(1);
  }
}
