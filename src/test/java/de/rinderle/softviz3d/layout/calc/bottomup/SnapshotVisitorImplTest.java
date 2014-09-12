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
package de.rinderle.softviz3d.layout.calc.bottomup;

import att.grappa.Graph;
import att.grappa.GrappaBox;
import de.rinderle.softviz3d.layout.calc.LayeredLayoutElement;
import de.rinderle.softviz3d.layout.dot.DotExcecutorException;
import de.rinderle.softviz3d.layout.dot.DotExecutor;
import de.rinderle.softviz3d.sonar.SonarMetric;
import de.rinderle.softviz3d.sonar.SonarSnapshot;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.sonar.api.config.Settings;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static junit.framework.TestCase.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyInt;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.*;

public class SnapshotVisitorImplTest {

    private Integer ID = 1;
    private static final String NAME = "testSnapshot";
    private static final Integer DEPTH = 3;
    private static final Double METRIC_FOOTPRINT_VALUE = 12.0;
    private static final Double METRIC_HEIGHT_VALUE = 14.0;

    @Mock
    private DotExecutor dotExecutor;
    @Mock
    private LayerFormatter formatter;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testVisitNodeMinimal() throws DotExcecutorException {
        Graph graph = createGraph();
        when(formatter.format(any(Graph.class), eq(DEPTH))).thenReturn(graph);

        Settings settings = new Settings();
        List<Double> minMaxValues = createMinMaxValues();
        SnapshotVisitorImpl underTest = new SnapshotVisitorImpl(formatter, dotExecutor, settings, minMaxValues);

        SonarSnapshot snapshot = new SonarSnapshot(ID, NAME, DEPTH, METRIC_FOOTPRINT_VALUE, METRIC_HEIGHT_VALUE);
        List<LayeredLayoutElement> elements = new ArrayList<LayeredLayoutElement>();

        LayeredLayoutElement result = underTest.visitNode(snapshot, elements);

        assertEquals(LayeredLayoutElement.Type.NODE, result.getElementType());
        assertEquals(ID, result.getId());
        assertEquals(NAME, result.getDisplayName());

        verify(dotExecutor, times(1)).run(any(Graph.class), eq(settings));
        verify(formatter, times(1)).format(any(Graph.class), anyInt());

        Map<Integer, Graph> graphResult = underTest.getResultingGraphList();
        assertTrue(graphResult.size() == 1);
        assertTrue(graphResult.containsKey(ID));
    }

    @Test
    public void testVisitNodeElements() throws DotExcecutorException {
        Graph graph = createGraph();
        when(formatter.format(any(Graph.class), eq(DEPTH))).thenReturn(graph);

        Settings settings = new Settings();
        List<Double> minMaxValues = createMinMaxValues();
        SnapshotVisitorImpl underTest = new SnapshotVisitorImpl(formatter, dotExecutor, settings, minMaxValues);

        SonarSnapshot snapshot = new SonarSnapshot(ID, NAME, DEPTH, METRIC_FOOTPRINT_VALUE, METRIC_HEIGHT_VALUE);

        List<LayeredLayoutElement> elements = new ArrayList<LayeredLayoutElement>();
        LayeredLayoutElement testElement = createLayeredLayoutElement();
        elements.add(testElement);
        LayeredLayoutElement result = underTest.visitNode(snapshot, elements);

        /**
         * no additional verification possible at the moment.
         */
    }

    @Test(expected = DotExcecutorException.class)
    public void testVisitNodeDotException() throws DotExcecutorException {
        Settings settings = new Settings();
        doThrow(DotExcecutorException.class).when(dotExecutor).run(any(Graph.class), eq(settings));

        List<Double> minMaxValues = createMinMaxValues();

        SnapshotVisitorImpl underTest = new SnapshotVisitorImpl(formatter, dotExecutor, settings, minMaxValues);

        SonarSnapshot snapshot = new SonarSnapshot(ID, NAME, DEPTH, METRIC_FOOTPRINT_VALUE, METRIC_HEIGHT_VALUE);
        List<LayeredLayoutElement> elements = new ArrayList<LayeredLayoutElement>();

        underTest.visitNode(snapshot, elements);
    }

    @Test
    public void testVisitLeaf() {
        Settings settings = new Settings();
        List<Double> minMaxValues = createMinMaxValues();
        SnapshotVisitorImpl underTest = new SnapshotVisitorImpl(formatter, dotExecutor, settings, minMaxValues);

        SonarSnapshot snapshot = new SonarSnapshot(ID, NAME, DEPTH, METRIC_FOOTPRINT_VALUE, METRIC_HEIGHT_VALUE);

        LayeredLayoutElement result = underTest.visitFile(snapshot);

        assertEquals(LayeredLayoutElement.Type.LEAF, result.getElementType());
        assertEquals(ID, result.getId());
        assertEquals(NAME, result.getDisplayName());

        verify(formatter, times(1)).calcBuildingHeight(eq(METRIC_HEIGHT_VALUE), any(SonarMetric.class));
        verify(formatter, times(1)).calcSideLength(eq(METRIC_FOOTPRINT_VALUE), any(SonarMetric.class));

        Map<Integer, Graph> graphResult = underTest.getResultingGraphList();
        assertTrue(graphResult.size() == 0);
    }

    private LayeredLayoutElement createLayeredLayoutElement() {
        LayeredLayoutElement.Type type = LayeredLayoutElement.Type.LEAF;
        Integer id = ID + 1;
        String name = "childName";
        Integer depth = 4;
        Double footprintMetricValue = 10.0;
        Double heightMetricValue = 12.0;

        SonarSnapshot snapshot = new SonarSnapshot(
                id, name, depth, footprintMetricValue, heightMetricValue);

        Double sideLength = 10.0;
        Double buildingHeight = 20.0;

        return LayeredLayoutElement.
                createLayeredLayoutLeafElement(snapshot, sideLength, buildingHeight);
    }

    private Graph createGraph() {
        Graph graph = new Graph("graph name");
        GrappaBox grappaBox = new GrappaBox(0,0,50,50);
        graph.setAttribute("bb", grappaBox);
        return graph;
    }

    private List<Double> createMinMaxValues() {
        List<Double> result = new ArrayList<Double>();

        result.add(0.0);
        result.add(10.0);
        result.add(0.0);
        result.add(20.0);

        return result;
    }

//    @Override
//    public LayeredLayoutElement visitNode(SonarSnapshot snapshot,
//            List<LayeredLayoutElement> elements) throws DotExcecutorException {
//
//        LOGGER.debug("LayoutVisitor.visitNode " + snapshot.getId() + " " + snapshot.getName());
//
//        // create layout graph
//        Graph inputGraph = new Graph(snapshot.getId().toString());
//
//        for (LayeredLayoutElement element : elements) {
//            Node elementNode = new Node(inputGraph, element.getName());
//            elementNode.setAttribute("id", element.getId().toString());
//            elementNode.setAttribute("type", element.getElementType().name());
//            elementNode.setAttribute(WIDTH_ATTR, element.getWidth());
//            elementNode.setAttribute(HEIGHT_ATTR, element.getHeight());
//
//            // keep the size of the node only dependend on the width and height
//            // attribute
//            // and not from the node name
//            elementNode.setAttribute(LABEL_ATTR, ".");
//
//            elementNode.setAttribute(SHAPE_ATTR, "box");
//
//            elementNode.setAttribute("buildingHeight", element
//                    .getBuildingHeight().toString());
//
//            elementNode.setAttribute("displayName", element.getDisplayName());
//
//            inputGraph.addNode(elementNode);
//        }
//
//        // run dot layout for this layer
//        Graph outputGraph = dotExecutor.run(inputGraph, settings);
//
//        // adjust graph
//        Graph adjustedGraph = formatter.format(outputGraph, snapshot.getDepth());
//        resultingGraphList.put(snapshot.getId(), adjustedGraph);
//
//        // adjusted graph has a bounding box !
//        GrappaBox bb = (GrappaBox) adjustedGraph.getAttributeValue("bb");
//
//        // The dot output of the bb is given in DPI. The actual width
//        // and height of the representing element has to be scaled
//        // back to normal
//        Double width = bb.getWidth() / SoftViz3dConstants.DPI_DOT_SCALE;
//        Double height = bb.getHeight() / SoftViz3dConstants.DPI_DOT_SCALE;
//
//        double buildingHeight = 2;
//
//        return new LayeredLayoutElement(Type.NODE,
//                snapshot.getId(), "dir_" + snapshot.getId(), width, height,
//                buildingHeight, snapshot.getName());
//    }
//
//    @Override
//    public LayeredLayoutElement visitFile(SonarSnapshot snapshot) {
//        LOGGER.debug("LayoutVisitor.visitNode " + snapshot.getId() + " " + snapshot.getName());
//
//        double sideLength = calcSideLength(snapshot.getFootprintMetricValue());
//
//        double buildingHeight = calcBuildingHeight(snapshot
//                .getHeightMetricValue());
//
//        return new LayeredLayoutElement(Type.LEAF, snapshot.getId(), "file_"
//                + snapshot.getId().toString(), sideLength, sideLength,
//                buildingHeight, snapshot.getName());
//    }
//
//    /**
//     * Building height is calculated in percent.
//     *
//     * The actual building size is dependent on the size of the biggest layer.
//     * This value is not available at this point of the calculation.
//     *
//     * @param value
//     *            Metric value for the building size
//     * @return percent 0-100%
//     */
//    private double calcBuildingHeight(Double value) {
//        double buildingHeight = 0.0;
//
//        if (value != null) {
//            // TODO start with 0 percent also in case of starting higher
//            Double maxValue = metricHeight.getMaxValue();
//
//            Double valuePercent = 0.0;
//            if (maxValue > 0 && value > 0) {
//                valuePercent = SoftViz3dConstants.PERCENT_DIVISOR / maxValue
//                        * value;
//            }
//
//            buildingHeight = valuePercent;
//        }
//
//        return buildingHeight;
//    }
//
//    private double calcSideLength(Double value) {
//        double sideLength = SoftViz3dConstants.MIN_SIDE_LENGTH;
//
//        if (value != null) {
//            // TODO start with 0 percent also in case of starting higher
//            // Double minValue = metricFootprint.getMinValue();
//            Double maxValue = metricFootprint.getMaxValue();
//
//            // create a linear distribution
//            Double onePercent = (SoftViz3dConstants.MAX_SIDE_LENGTH - SoftViz3dConstants.MIN_SIDE_LENGTH)
//                    / SoftViz3dConstants.PERCENT_DIVISOR;
//            Double valuePercent = 0.0;
//            if (maxValue > 0 && value > 0) {
//                valuePercent = SoftViz3dConstants.PERCENT_DIVISOR / maxValue
//                        * value;
//            }
//
//            sideLength = SoftViz3dConstants.MIN_SIDE_LENGTH + valuePercent
//                    * onePercent;
//        }
//
//        return sideLength;
//    }

}
