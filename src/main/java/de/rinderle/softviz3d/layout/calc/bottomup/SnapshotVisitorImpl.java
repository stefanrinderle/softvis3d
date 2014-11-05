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
import de.rinderle.softviz3d.layout.calc.Edge;
import de.rinderle.softviz3d.layout.calc.LayeredLayoutElement;
import de.rinderle.softviz3d.layout.calc.LayoutViewType;
import de.rinderle.softviz3d.layout.dot.DotExcecutorException;
import de.rinderle.softviz3d.layout.dot.DotExecutor;
import de.rinderle.softviz3d.layout.interfaces.SoftViz3dConstants;
import de.rinderle.softviz3d.sonar.MinMaxValueDTO;
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

  // getting injected - see constructor
  private DotExecutor dotExecutor;
  private LayerFormatter formatter;

  private Settings settings;

  private MinMaxValueDTO minMaxMetricFootprint;
  private MinMaxValueDTO minMaxMetricHeight;
  private MinMaxValueDTO minMaxEdgeCounter;

  private Map<Integer, Graph> resultingGraphList = new HashMap<Integer, Graph>();

  private LayoutViewType viewType;

  @Inject
  public SnapshotVisitorImpl(final LayerFormatter formatter,
    final DotExecutor dotExecutor,
    @Assisted final Settings settings,
    @Assisted final LayoutViewType viewType,
    @Assisted(value = "minMaxFootprintMetricValues") final MinMaxValueDTO minMaxFootprintMetricValues,
    @Assisted(value = "minMaxHeightMetricValues") final MinMaxValueDTO minMaxHeightMetricValues,
    @Assisted(value = "minMaxEdgeCounter") final MinMaxValueDTO minMaxEdgeCounter) {
    this.settings = settings;

    this.minMaxMetricFootprint = minMaxFootprintMetricValues;
    this.minMaxMetricHeight = minMaxHeightMetricValues;
    this.minMaxEdgeCounter = minMaxEdgeCounter;

    this.dotExecutor = dotExecutor;
    this.formatter = formatter;

    this.viewType = viewType;
  }

  @Override
  public Map<Integer, Graph> getResultingGraphList() {
    return this.resultingGraphList;
  }

  @Override
  public LayeredLayoutElement visitNode(final TreeNode node,
    final List<LayeredLayoutElement> elements) throws DotExcecutorException {

    LOGGER.debug("LayoutVisitor.visitNode " + node.getId() + " " + node.getName());

    // create layout graph
    final Graph inputGraph = new Graph(node.getId().toString());

    for (final LayeredLayoutElement element : elements) {
      final Node elementNode = this.transformToGrappaNode(inputGraph, element);
      inputGraph.addNode(elementNode);
    }

    for (final LayeredLayoutElement element : elements) {
      for (final Edge edge : element.getEdges().values()) {
        inputGraph.addEdge(this.transformToGrappaEdge(inputGraph, edge));
      }
    }

    LOGGER.debug("--------------------------------------");

    // inputGraph.printGraph(System.out);

    // run dot layout for this layer
    final Graph outputGraph = this.dotExecutor.run(inputGraph, this.settings, this.viewType);

    // adjust graph
    this.formatter.format(outputGraph, node.getDepth(), this.viewType);

    LOGGER.debug("--------------------------------------");

    // outputGraph.printGraph(System.out);

    LOGGER.debug("--------------------------------------");

    this.resultingGraphList.put(node.getId(), outputGraph);

    // adjusted graph has a bounding box !
    final GrappaBox bb = (GrappaBox) outputGraph.getAttributeValue("bb");

    /**
     * The dot output of the bb is given in DPI. The actual width
     * and height of the representing element has to be scaled
     * back to normal
     */
    final Double width = bb.getWidth() / SoftViz3dConstants.DPI_DOT_SCALE;
    final Double height = bb.getHeight() / SoftViz3dConstants.DPI_DOT_SCALE;

    final double platformHeight = 5;

    return LayeredLayoutElement.createLayeredLayoutNodeElement(node, width, height, platformHeight);
  }

  private att.grappa.Edge transformToGrappaEdge(final Graph inputGraph, final Edge edge) {
    final Node sourceNode = this.searchNodeById(inputGraph, edge.getSourceId());
    final Node destNode = this.searchNodeById(inputGraph, edge.getDestinationId());

    if (sourceNode != null && destNode != null) {
      final att.grappa.Edge result = new att.grappa.Edge(inputGraph, sourceNode, destNode);
      double edgeRadius = this.formatter.calcEdgeRadius(edge.getCounter(), this.minMaxEdgeCounter);
      result.setAttribute("edgeRadius", "x" + edgeRadius);

      return result;
    }

    return null;
  }

  private Node searchNodeById(final Graph inputGraph, final Integer sourceId) {
    for (final Node node : inputGraph.nodeElementsAsArray()) {
      final Integer nodeId = Integer.valueOf((String) node.getAttributeValue("id"));
      if (nodeId.equals(sourceId)) {
        return node;
      }
    }

    return null;
  }

  private Node transformToGrappaNode(final Graph inputGraph, final LayeredLayoutElement element) {
    final Node elementNode = new Node(inputGraph, element.getName());
    elementNode.setAttribute("id", element.getId().toString());
    elementNode.setAttribute("type", element.getElementType().name());
    elementNode.setAttribute(WIDTH_ATTR, this.roundTo2Decimals(element.getWidth()));
    elementNode.setAttribute(HEIGHT_ATTR, this.roundTo2Decimals(element.getHeight()));

    // keep the size of the node only dependent on the width and height
    // attribute and not from the node name
    elementNode.setAttribute(LABEL_ATTR, ".");
    elementNode.setAttribute(SHAPE_ATTR, "box");

    elementNode.setAttribute(SoftViz3dConstants.GRAPH_ATTR_BUILDING_HEIGHT, element.getBuildingHeight());

    elementNode.setAttribute("displayName", element.getDisplayName());
    return elementNode;
  }

  private double roundTo2Decimals(final double value) {
    return Math.round(value * 100.0) / 100.0;
  }

  @Override
  public LayeredLayoutElement visitFile(final TreeNode leaf) {
    LOGGER.debug("Leaf : " + leaf.getId() + " " + leaf.getName());
    double sideLength = this.formatter.calcSideLength(leaf.getFootprintMetricValue(), this.minMaxMetricFootprint);
    sideLength = sideLength / SoftViz3dConstants.DPI_DOT_SCALE;

    double buildingHeight = this.formatter.calcBuildingHeight(leaf.getHeightMetricValue(), this.minMaxMetricHeight);
    buildingHeight = buildingHeight / SoftViz3dConstants.DPI_DOT_SCALE;

    buildingHeight = buildingHeight * 100;

    if (TreeNodeType.DEPENDENCY_GENERATED.equals(leaf.getType()) &&
      LayoutViewType.DEPENDENCY.equals(this.viewType)) {
      buildingHeight = 200;
    }

    return LayeredLayoutElement.createLayeredLayoutLeafElement(leaf, sideLength, sideLength, buildingHeight);
  }

}
