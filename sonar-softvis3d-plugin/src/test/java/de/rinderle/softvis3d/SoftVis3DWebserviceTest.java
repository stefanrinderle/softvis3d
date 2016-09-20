/**
 * SoftVis3D Sonar plugin
 * Copyright (C) 2016 Stefan Rinderle and Yvo Niedrich
 * stefan@rinderle.info / yvo.niedrich@gmail.com
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
import org.sonar.api.server.ws.WebService;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class SoftVis3DWebserviceTest {

  final WebService.Context context = new WebService.Context();

  @Before
  public void setUp() {
    final WebService webservice = new SoftVis3DWebservice();

    webservice.define(context);
  }

  @Test
  public void testController() throws Exception {
    assertEquals(1, context.controllers().size());

    final WebService.Controller softVis3dController = context.controller("api/softVis3D");
    assertNotNull(softVis3dController);
    assertEquals(1, softVis3dController.actions().size());
  }

  @Test
  public void testVisualizationWebservice() throws Exception {
    final WebService.Controller softVis3dController = context.controller("api/softVis3D");

    final WebService.Action visualizationAction = softVis3dController.action("getVisualization");
    assertNotNull(visualizationAction);
    assertEquals(4, visualizationAction.params().size());
  }

}
