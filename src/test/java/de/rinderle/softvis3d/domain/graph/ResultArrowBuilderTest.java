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
package de.rinderle.softvis3d.domain.graph;

import att.grappa.Edge;
import att.grappa.Graph;
import att.grappa.GrappaConstants;
import att.grappa.GrappaLine;
import att.grappa.GrappaPoint;
import att.grappa.Node;
import att.grappa.Subgraph;
import de.rinderle.softvis3d.domain.SoftVis3DConstants;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

/**
 * Created by stefan on 29.05.15.
 */
public class ResultArrowBuilderTest {

  private static final String TAIL_NODE = "tailNode";
  private static final String HEAD_NODE = "headNode";

  private static final Double RADIUS = 2.4;

  @Test
  public void testCopyValues() throws Exception {
    final Edge edge = createExampleEdge();

    final ResultArrow result = new ResultArrowBuilder().withEdge(edge).createResultArrow();

    assertEquals(result.getHeadId(), HEAD_NODE);
    assertEquals(result.getTailId(), TAIL_NODE);
    assertEquals(result.getColor().getBlue(), 255);
  }

  @Test
  public void testRadius() throws Exception {
    final Edge edge = createExampleEdge();

    final ResultArrow result = new ResultArrowBuilder().withEdge(edge).createResultArrow();

    assertEquals(result.getRadius(), RADIUS.doubleValue(), 0.001);
  }

  @Test
  public void testPointsRemoveLastPoint() throws Exception {
    final Edge edge = createExampleEdge();

    final ResultArrow result = new ResultArrowBuilder().withEdge(edge).createResultArrow();

    assertEquals(2, result.getLinePoints().size());
    final Point3d secondPoint = result.getLinePoints().get(1);
    assertEquals(2.0, secondPoint.getX(), 0.001);
  }

  @Test
  public void testPointsRemovePoints() throws Exception {
    final Edge edge = createExampleEdge();

    final ResultArrow result = new ResultArrowBuilder().withEdge(edge).createResultArrow();

    assertEquals(2, result.getLinePoints().size());
    final Point3d firstPoint = result.getLinePoints().get(0);
    assertEquals(0.0, firstPoint.getX(), 0.001);
    assertEquals(0.0, firstPoint.getY(), 0.001);
    assertEquals(1.0, firstPoint.getZ(), 0.001);

    final Point3d secondPoint = result.getLinePoints().get(1);
    assertEquals(2.0, secondPoint.getX(), 0.001);
    assertEquals(0.0, secondPoint.getY(), 0.001);
    assertEquals(3.0, secondPoint.getZ(), 0.001);
  }

  private Edge createExampleEdge() {
    final Subgraph subgraph = new Graph("testGraph", true, false);
    final Node tail = new Node(subgraph, TAIL_NODE);
    final Node head = new Node(subgraph, HEAD_NODE);
    final Edge edge = new Edge(subgraph, tail, head);

    final GrappaPoint[] points = new GrappaPoint[3];
    points[0] = new GrappaPoint(0, 1);
    points[1] = new GrappaPoint(2, 3);
    points[2] = new GrappaPoint(100, 100);

    final GrappaLine pos = new GrappaLine(points, 0);
    edge.setAttribute(GrappaConstants.POS_ATTR, pos);

    final String radius = "x" + RADIUS.toString();
    edge.setAttribute(SoftVis3DConstants.GRAPH_ATTR_EDGE_RADIUS, radius);
    return edge;
  }

}
