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
package de.rinderle.softvis3d.postprocessing;

import att.grappa.Edge;
import att.grappa.Graph;
import att.grappa.GrappaBox;
import att.grappa.GrappaConstants;
import att.grappa.GrappaLine;
import att.grappa.GrappaPoint;
import att.grappa.Node;
import att.grappa.Subgraph;
import de.rinderle.softvis3d.domain.LayoutConstants;
import de.rinderle.softvis3d.domain.graph.ResultArrow;
import de.rinderle.softvis3d.domain.graph.ResultArrowBuilder;
import de.rinderle.softvis3d.domain.graph.ResultPlatform;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class TranslateArrowTest {

  private final TranslateArrow underTest = new TranslateArrow();

  @Test
  public void testTranslateNoChange() throws Exception {
    final double radius = 3.3;
    final GrappaPoint examplePoint = new GrappaPoint(1, 2);
    final Edge edge = createExampleEdge(radius, examplePoint);
    final ResultArrow arrow = new ResultArrowBuilder().withEdge(edge).createResultArrow();

    final GrappaPoint posTranslation = new GrappaPoint(0, 0);
    final GrappaBox translatedBb = new GrappaBox(0, 0, 0, 0);
    final int height3d = 0;

    underTest.translate(arrow, posTranslation, translatedBb, height3d);

    assertEquals(radius, arrow.getRadius(), 0.0);
    assertEquals(1, arrow.getLinePoints().get(0).getX(), 0.0);
    assertEquals(2, arrow.getLinePoints().get(0).getZ(), 0.0);

    final double height3dAfterTranslation = arrow.getLinePoints().get(0).getY();
    assertTrue(height3dAfterTranslation > (height3d + ResultPlatform.PLATFORM_HEIGHT));
    assertTrue(height3dAfterTranslation < (height3d + ResultPlatform.PLATFORM_HEIGHT + radius));
  }

  @Test
  public void testTranslate() throws Exception {
    final GrappaPoint examplePoint = new GrappaPoint(1, 2);
    final Edge edge = createExampleEdge(3.3, examplePoint);
    final ResultArrow arrow = new ResultArrowBuilder().withEdge(edge).createResultArrow();

    final GrappaPoint posTranslation = new GrappaPoint(54, 99);
    final GrappaBox translatedBb = new GrappaBox(0, 0, 23, 76);

    underTest.translate(arrow, posTranslation, translatedBb, 0);

    assertEquals(43.5, arrow.getLinePoints().get(0).getX(), 0.0);
    assertEquals(139.0, arrow.getLinePoints().get(0).getZ(), 0.0);
  }

  private Edge createExampleEdge(final double radius, final GrappaPoint point) {
    final Subgraph subgraph = new Graph("testGraph", true, false);
    final Node tail = new Node(subgraph, "tailNode");
    final Node head = new Node(subgraph, "headNode");
    final Edge edge = new Edge(subgraph, tail, head);

    final GrappaPoint[] points = new GrappaPoint[3];
    points[0] = point;
    points[1] = new GrappaPoint(2, 3);
    points[2] = new GrappaPoint(100, 100);

    final GrappaLine pos = new GrappaLine(points, 0);
    edge.setAttribute(GrappaConstants.POS_ATTR, pos);

    final String radiusString = "x" + radius;
    edge.setAttribute(LayoutConstants.GRAPH_ATTR_EDGE_RADIUS, radiusString);
    return edge;
  }
}