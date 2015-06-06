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
package de.rinderle.softvis3d.layout.dot;

import de.rinderle.softvis3d.domain.SoftVis3DConstants;
import org.junit.Test;

import static att.grappa.GrappaConstants.HEIGHT_ATTR;
import static org.junit.Assert.assertEquals;

/**
 * Created by stefan on 29.05.15.
 */
public class ExecuteCommandTest {

  @Test
  public void checkForAdotBugHeight() throws Exception {
    final String value = "123";

    final String postFix = "idsuoisdufhoisufh";

    final String check = HEIGHT_ATTR + "=" + value + "," + postFix;
    final String expected = HEIGHT_ATTR + "=\"" + value + "\"," + postFix;

    String result = ExecuteCommand.checkForAdotBug(check);

    assertEquals(expected, result);
  }

  @Test
  public void checkForAdotBugWidthAtEnd() throws Exception {
    final String check = "width=0.27778];";
    final String expected = "width=\"0.27778\"];";

    String result = ExecuteCommand.checkForAdotBug(check);

    assertEquals(expected, result);
  }

  @Test
  public void checkForAdotBugWidth() throws Exception {
    final String check = "width=0.27778";
    final String expected = "width=\"0.27778\"";

    String result = ExecuteCommand.checkForAdotBug(check);

    assertEquals(expected, result);
  }

  @Test
  public void checkForAdotBugPenWidth() throws Exception {
    final String value = "123";

    final String postFix = "idsuoisdufhoisufh";

    final String check = SoftVis3DConstants.GRAPH_ATTR_PENWIDTH + "=" + value + "," + postFix;

    String result = ExecuteCommand.checkForAdotBug(check);

    assertEquals("Do not add quotation marks if the attribute is the oen width", check, result);
  }
}