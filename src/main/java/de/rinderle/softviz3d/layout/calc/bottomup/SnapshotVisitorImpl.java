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
import att.grappa.Node;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;
import de.rinderle.softviz3d.layout.calc.LayeredLayoutElement;
import de.rinderle.softviz3d.layout.calc.LayoutViewType;
import de.rinderle.softviz3d.layout.dot.DotExcecutorException;
import de.rinderle.softviz3d.layout.dot.DotExecutor;
import de.rinderle.softviz3d.layout.interfaces.SoftViz3dConstants;
import de.rinderle.softviz3d.sonar.SonarMetric;
import de.rinderle.softviz3d.tree.TreeNode;
import de.rinderle.softviz3d.tree.TreeNodeType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.config.Settings;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static att.grappa.GrappaConstants.*;

public class SnapshotVisitorImpl implements SnapshotVisitor {

    private static final Logger LOGGER = LoggerFactory.getLogger(SnapshotVisitorImpl.class);

    private Settings settings;

    private SonarMetric metricFootprint;
    private SonarMetric metricHeight;

    private LayerFormatter formatter;

    private Map<Integer, Graph> resultingGraphList = new HashMap<Integer, Graph>();

    private DotExecutor dotExecutor;

    private LayoutViewType viewType;

    @Inject
    public SnapshotVisitorImpl(LayerFormatter formatter,
                               DotExecutor dotExecutor,
                               @Assisted Settings settings,
                               @Assisted List<Double> minMaxValues,
                               @Assisted LayoutViewType viewType) {
        this.settings = settings;

        this.metricFootprint = new SonarMetric(minMaxValues.get(0), minMaxValues.get(1));
        this.metricHeight = new SonarMetric(minMaxValues.get(2), minMaxValues.get(3));

        this.dotExecutor = dotExecutor;
        this.formatter = formatter;

        this.viewType = viewType;
    }

    @Override
    public Map<Integer, Graph> getResultingGraphList() {
        return this.resultingGraphList;
    }

    @Override
    public LayeredLayoutElement visitNode(TreeNode node,
                                          List<LayeredLayoutElement> elements) throws DotExcecutorException {

        LOGGER.debug("LayoutVisitor.visitNode " + node.getId() + " " + node.getName());

        // create layout graph
        Graph inputGraph = new Graph(node.getId().toString());

        for (LayeredLayoutElement element : elements) {
            Node elementNode = transformToGrappaNode(inputGraph, element);
            inputGraph.addNode(elementNode);
        }

        // run dot layout for this layer
        Graph outputGraph = dotExecutor.run(inputGraph, settings);

        // adjust graph
        //Graph adjustedGraph =
        formatter.format(outputGraph, node.getDepth(), viewType);
        resultingGraphList.put(node.getId(), outputGraph);

        // adjusted graph has a bounding box !
        GrappaBox bb = (GrappaBox) outputGraph.getAttributeValue("bb");

        // The dot output of the bb is given in DPI. The actual width
        // and height of the representing element has to be scaled
        // back to normal
        Double width = bb.getWidth() / SoftViz3dConstants.DPI_DOT_SCALE;
        Double height = bb.getHeight() / SoftViz3dConstants.DPI_DOT_SCALE;

        double platformHeight = 2 * 15;

        return LayeredLayoutElement.createLayeredLayoutNodeElement(node, width, height, platformHeight);
    }

    private Node transformToGrappaNode(Graph inputGraph, LayeredLayoutElement element) {
        Node elementNode = new Node(inputGraph, element.getName());
        elementNode.setAttribute("id", element.getId().toString());
        elementNode.setAttribute("type", element.getElementType().name());
        elementNode.setAttribute(WIDTH_ATTR, element.getWidth());
        elementNode.setAttribute(HEIGHT_ATTR, element.getHeight());

        // keep the size of the node only dependent on the width and height
        // attribute and not from the node name
        elementNode.setAttribute(LABEL_ATTR, ".");
        elementNode.setAttribute(SHAPE_ATTR, "box");

        elementNode.setAttribute(SoftViz3dConstants.GRAPH_ATTR_BUILDING_HEIGHT, element.getBuildingHeight());

        elementNode.setAttribute("displayName", element.getDisplayName());
        return elementNode;
    }

    @Override
    public LayeredLayoutElement visitFile(TreeNode leaf) {
        LOGGER.debug("LayoutVisitor.visitNode " + leaf.getId() + " " + leaf.getName());

        double sideLength = formatter.calcSideLength(leaf.getFootprintMetricValue(), metricFootprint);
        sideLength = sideLength / SoftViz3dConstants.DPI_DOT_SCALE;

        double buildingHeight = formatter.calcBuildingHeight(leaf.getHeightMetricValue(), metricHeight);
        buildingHeight = buildingHeight / SoftViz3dConstants.DPI_DOT_SCALE;

        buildingHeight = buildingHeight  * 100;

        if (TreeNodeType.DEPENDENCY_GENERATED.equals(leaf.getType()) &&
                LayoutViewType.DEPENDENCY.equals(viewType)) {
            buildingHeight = 200;
        }

        return LayeredLayoutElement.createLayeredLayoutLeafElement(leaf, sideLength, sideLength, buildingHeight);
    }

}
