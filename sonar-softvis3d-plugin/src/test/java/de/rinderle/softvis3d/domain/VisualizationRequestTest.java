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
package de.rinderle.softvis3d.domain;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertTrue;

/**
 * Wrapper class for a visualization request.
 */
public class VisualizationRequestTest {

  @Test
  public void testHashCode() {
    final String[] metrics = {"ncolc", "complediy"};
    VisualizationRequest request1 = new VisualizationRequest("1", metrics);
    VisualizationRequest request2 = new VisualizationRequest("1", metrics);

    assertEquals(request1.hashCode(), request2.hashCode());

    request1 = new VisualizationRequest("1", metrics);
    request2 = new VisualizationRequest("2", metrics);

    assertNotEquals(request1.hashCode(), request2.hashCode());
  }

  @Test
  public void testEqualsCode() {
    final String[] metrics = {"ncolc", "complediy"};
    VisualizationRequest request1 = new VisualizationRequest("1", metrics);
    VisualizationRequest request2 = new VisualizationRequest("1", metrics);

    assertTrue(request1.equals(request2));

    request1 = new VisualizationRequest("1", metrics);
    request2 = new VisualizationRequest("2", metrics);

    assertFalse(request1.equals(request2));

    assertFalse(request1.equals(null));
    assertFalse(request1.equals("123"));
    assertTrue(request1.equals(request1));
  }

  @Test
  public void testToString() {
    final String rootSnapshotKey = "1";
    final String metric1 = "ncolc";
    final String metric2 = "complediy";

    final String[] metrics = {metric1, metric2};
    final VisualizationRequest request1 = new VisualizationRequest(rootSnapshotKey, metrics);

    assertTrue(request1.toString().contains(rootSnapshotKey));
    assertTrue(request1.toString().contains(metric1));
    assertTrue(request1.toString().contains(metric2));
  }
}
