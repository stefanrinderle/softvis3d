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

public class SnapshotVisitorImpl implements SnapshotVisitor {

  private static final Logger LOGGER = LoggerFactory.getLogger(SnapshotVisitorImpl.class);

  // getting injected - see constructor
  private DotExecutor dotExecutor;
  private LayerFormatter formatter;
  private GrappaTransformer tranformer;

  private Settings settings;

  private MinMaxValueDTO minMaxMetricFootprint;
  private MinMaxValueDTO minMaxMetricHeight;
  private MinMaxValueDTO minMaxEdgeCounter;

  private Map<Integer, Graph> resultingGraphList = new HashMap<Integer, Graph>();

  private LayoutViewType viewType;

  @Inject
  public SnapshotVisitorImpl(final LayerFormatter formatter,
    final DotExecutor dotExecutor, final GrappaTransformer tranformer,
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
    this.tranformer = tranformer;

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
      final Node elementNode = tranformer.transformToGrappaNode(inputGraph, element);
      inputGraph.addNode(elementNode);
    }

    for (final LayeredLayoutElement element : elements) {
      for (final Edge edge : element.getEdges().values()) {
        inputGraph.addEdge(tranformer.transformToGrappaEdge(inputGraph, edge, this.minMaxEdgeCounter));
      }
    }

    // run dot layout for this layer
    final Graph outputGraph = this.dotExecutor.run(inputGraph, this.settings, this.viewType);

    // adjust graph
    this.formatter.format(outputGraph, node.getDepth(), this.viewType);

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
