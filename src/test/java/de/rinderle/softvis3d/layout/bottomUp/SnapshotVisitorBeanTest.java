/*
 * SoftVis3D Sonar plugin
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
package de.rinderle.softvis3d.layout.bottomUp;

import att.grappa.Graph;
import att.grappa.GrappaBox;
import de.rinderle.softvis3d.domain.layout.LayeredLayoutElement;
import de.rinderle.softvis3d.layout.dot.DotExecutor;
import de.rinderle.softvis3d.layout.dot.DotExecutorException;
import de.rinderle.softvis3d.layout.format.LayerFormatter;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.sonar.api.config.Settings;

import java.util.ArrayList;
import java.util.List;

public class SnapshotVisitorBeanTest {

  private static final String NAME = "testSnapshot";
  private static final Integer DEPTH = 3;
  private static final Double METRIC_FOOTPRINT_VALUE = 12.0;
  private static final Double METRIC_HEIGHT_VALUE = 14.0;
  private Integer ID = 1;
  @Mock
  private DotExecutor dotExecutor;
  @Mock
  private LayerFormatter formatter;

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
  }

  @Test
  public void testVisitNodeMinimal() throws DotExecutorException {
    final Graph graph = this.createGraph();
    // when(dotExecutor.run(any(Graph.class), any(Settings.class))).thenReturn(graph);

    final Settings settings = new Settings();
    final List<Double> minMaxValues = this.createMinMaxValues();
    // SnapshotVisitorImpl underTest = new SnapshotVisitorImpl(formatter, dotExecutor, settings, minMaxValues);

    // SonarSnapshot snapshot = new SonarSnapshot(ID, NAME, DEPTH, METRIC_FOOTPRINT_VALUE, METRIC_HEIGHT_VALUE);
    final List<LayeredLayoutElement> elements = new ArrayList<LayeredLayoutElement>();

    // LayeredLayoutElement result = underTest.visitNode(snapshot, elements);
    //
    // assertEquals(LayeredLayoutElement.Type.NODE, result.getElementType());
    // assertEquals(ID, result.getId());
    // assertEquals(NAME, result.getDisplayName());
    //
    // verify(dotExecutor, times(1)).run(any(Graph.class), eq(settings));
    // verify(formatter, times(1)).format(any(Graph.class), anyInt());
    //
    // Map<Integer, Graph> graphResult = underTest.getResultingGraphList();
    // assertTrue(graphResult.size() == 1);
    // assertTrue(graphResult.containsKey(ID));
  }

  @Test
  public void testVisitNodeElements() throws DotExecutorException {
    final Graph graph = this.createGraph();
    // when(dotExecutor.run(any(Graph.class), any(Settings.class))).thenReturn(graph);

    final Settings settings = new Settings();
    final List<Double> minMaxValues = this.createMinMaxValues();
    // SnapshotVisitorImpl underTest = new SnapshotVisitorImpl(formatter, dotExecutor, settings, minMaxValues);

    // SonarSnapshot snapshot = new SonarSnapshot(ID, NAME, DEPTH, METRIC_FOOTPRINT_VALUE, METRIC_HEIGHT_VALUE);

    final List<LayeredLayoutElement> elements = new ArrayList<LayeredLayoutElement>();
    // LayeredLayoutElement testElement = createLayeredLayoutElement();
    // elements.add(testElement);
    // LayeredLayoutElement result = underTest.visitNode(snapshot, elements);

    /**
     * no additional verification possible at the moment.
     */
  }

  // @Test(expected = DotExcecutorException.class)
  // public void testVisitNodeDotException() throws DotExcecutorException {
  // Settings settings = new Settings();
  // doThrow(DotExcecutorException.class).when(dotExecutor).run(any(Graph.class), eq(settings));
  //
  // List<Double> minMaxValues = createMinMaxValues();
  //
  // SnapshotVisitorImpl underTest = new SnapshotVisitorImpl(formatter, dotExecutor, settings, minMaxValues);
  //
  // SonarSnapshot snapshot = new SonarSnapshot(ID, NAME, DEPTH, METRIC_FOOTPRINT_VALUE, METRIC_HEIGHT_VALUE);
  // List<LayeredLayoutElement> elements = new ArrayList<LayeredLayoutElement>();

  // underTest.visitNode(snapshot, elements);
  // }

  @Test
  public void testVisitLeaf() {
    final Settings settings = new Settings();
    final List<Double> minMaxValues = this.createMinMaxValues();
    // SnapshotVisitorImpl underTest = new SnapshotVisitorImpl(formatter, dotExecutor, settings, minMaxValues);

    // SonarSnapshot snapshot = new SonarSnapshot(ID, NAME, DEPTH, METRIC_FOOTPRINT_VALUE, METRIC_HEIGHT_VALUE);

    // LayeredLayoutElement result = underTest.visitFile(snapshot);
    //
    // assertEquals(LayeredLayoutElement.Type.LEAF, result.getElementType());
    // assertEquals(ID, result.getId());
    // assertEquals(NAME, result.getDisplayName());
    //
    // verify(formatter, times(1)).calcBuildingHeight(eq(METRIC_HEIGHT_VALUE), any(SonarMetric.class));
    // verify(formatter, times(1)).calcSideLength(eq(METRIC_FOOTPRINT_VALUE), any(SonarMetric.class));
    //
    // Map<Integer, Graph> graphResult = underTest.getResultingGraphList();
    // assertTrue(graphResult.size() == 0);
  }

  // private LayeredLayoutElement createLayeredLayoutElement() {
  // LayeredLayoutElement.Type type = LayeredLayoutElement.Type.LEAF;
  // Integer id = ID + 1;
  // String name = "childName";
  // Integer depth = 4;
  // Double footprintMetricValue = 10.0;
  // Double heightMetricValue = 12.0;
  //
  // SonarSnapshot snapshot = new SonarSnapshot(
  // id, name, depth, footprintMetricValue, heightMetricValue);
  //
  // Double sideLength = 10.0;
  // Double buildingHeight = 20.0;

  // return LayeredLayoutElement.
  // createLayeredLayoutLeafElement(snapshot, sideLength, sideLength, buildingHeight);
  // }

  private Graph createGraph() {
    final Graph graph = new Graph("graph name");
    final GrappaBox grappaBox = new GrappaBox(0, 0, 50, 50);
    graph.setAttribute("bb", grappaBox);
    return graph;
  }

  private List<Double> createMinMaxValues() {
    final List<Double> result = new ArrayList<Double>();

    result.add(0.0);
    result.add(10.0);
    result.add(0.0);
    result.add(20.0);

    return result;
  }

}
