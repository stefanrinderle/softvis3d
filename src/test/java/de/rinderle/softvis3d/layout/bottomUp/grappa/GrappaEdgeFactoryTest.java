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
package de.rinderle.softvis3d.layout.bottomUp.grappa;

import att.grappa.Graph;
import att.grappa.Node;
import de.rinderle.softvis3d.domain.tree.Edge;
import de.rinderle.softvis3d.layout.format.LayerFormatter;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.Assert.assertNotNull;
import static org.mockito.Matchers.anyInt;
import static org.mockito.Mockito.when;

/**
 * Created by stefan on 06.06.15.
 */
public class GrappaEdgeFactoryTest {

  private static final Integer SOURCE_ID = 1;
  private static final String SOURCE_NAME = "first";
  private static final Integer DESTINATION_ID = 2;
  private static final String DESTINATION_NAME = "second";

  @Mock
  private LayerFormatter formatter;

  @InjectMocks
  private final GrappaEdgeFactory underTest = new GrappaEdgeFactory();

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
  }

  @Test
  public void testCreateGrappaEdge() throws Exception {
    final Graph inputGraph = createExampleGraph();

    final Edge edge = new Edge("depEdgeLabel", SOURCE_ID, SOURCE_NAME, DESTINATION_ID, DESTINATION_NAME);

    when(this.formatter.calcEdgeRadius(anyInt())).thenReturn(3.33);

    att.grappa.Edge result = underTest.createGrappaEdge(inputGraph, edge);

    assertNotNull(result);
  }

  @Test(expected = IllegalArgumentException.class)
  public void testWrongSourceId() throws Exception {
    final Graph inputGraph = createExampleGraph();

    final Edge edge = new Edge("depEdgeLabel", 999, SOURCE_NAME, DESTINATION_ID, DESTINATION_NAME);
    underTest.createGrappaEdge(inputGraph, edge);
  }

  @Test(expected = IllegalArgumentException.class)
  public void testWrongDestinationId() throws Exception {
    final Graph inputGraph = createExampleGraph();

    final Edge edge = new Edge("depEdgeLabel", 999, SOURCE_NAME, DESTINATION_ID, DESTINATION_NAME);
    underTest.createGrappaEdge(inputGraph, edge);
  }

  private Graph createExampleGraph() {
    final Graph inputGraph = new Graph("name");
    Node node1 = new Node(inputGraph, SOURCE_NAME);
    node1.setAttribute("id", SOURCE_ID.toString());
    inputGraph.addNode(node1);
    Node node2 = new Node(inputGraph, DESTINATION_NAME);
    node2.setAttribute("id", DESTINATION_ID.toString());
    inputGraph.addNode(node2);
    return inputGraph;
  }
}