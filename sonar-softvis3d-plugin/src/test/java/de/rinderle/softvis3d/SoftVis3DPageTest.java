/**
 * SoftVis3D Sonar plugin
 * Copyright (C) 2016 Stefan Rinderle
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

import de.rinderle.softvis3d.domain.SoftVis3DConstants;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

/**
 * Created by stefan on 10.07.15.
 */
public class SoftVis3DPageTest {

  @Test
  public void testGetId() throws Exception {
    final SoftVis3DPage softVis3DPage = new SoftVis3DPage();

    assertEquals(SoftVis3DConstants.PLUGIN_KEY, softVis3DPage.getId());
  }

  @Test
  public void testGetTitle() throws Exception {
    final SoftVis3DPage softVis3DPage = new SoftVis3DPage();

    assertEquals(SoftVis3DConstants.PLUGIN_NAME, softVis3DPage.getTitle());
  }

  @Test
  public void testGetTemplatePath() throws Exception {
    final SoftVis3DPage softVis3DPage = new SoftVis3DPage();

    assertEquals(SoftVis3DConstants.PLUGIN_TEMPLATE_PATH, softVis3DPage.getTemplatePath());
  }
}
