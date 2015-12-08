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
package de.rinderle.softvis3d.layout.bottomup;

import att.grappa.Graph;
import att.grappa.GrappaBox;
import att.grappa.Node;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;
import de.rinderle.softvis3d.VisualizationAdditionalInfos;
import de.rinderle.softvis3d.VisualizationSettings;
import de.rinderle.softvis3d.domain.LayoutViewType;
import de.rinderle.softvis3d.domain.MinMaxValue;
import de.rinderle.softvis3d.domain.SoftVis3DConstants;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.graph.ResultPlatform;
import de.rinderle.softvis3d.domain.layout.LayeredLayoutElement;
import de.rinderle.softvis3d.domain.tree.DependencyTreeNode;
import de.rinderle.softvis3d.domain.tree.Edge;
import de.rinderle.softvis3d.domain.tree.TreeNode;
import de.rinderle.softvis3d.domain.tree.TreeNodeType;
import de.rinderle.softvis3d.domain.tree.ValueTreeNode;
import de.rinderle.softvis3d.layout.bottomup.grappa.GrappaEdgeFactory;
import de.rinderle.softvis3d.layout.bottomup.grappa.GrappaNodeFactory;
import de.rinderle.softvis3d.layout.dot.DotExecutor;
import de.rinderle.softvis3d.layout.dot.DotExecutorException;
import de.rinderle.softvis3d.layout.dot.GraphvizPath;
import de.rinderle.softvis3d.layout.format.LayerFormatter;
import de.rinderle.softvis3d.layout.helper.HexaColor;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.apache.commons.lang.SystemUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SnapshotVisitorBean implements SnapshotVisitor {

  private static final Logger LOGGER = LoggerFactory.getLogger(SnapshotVisitorBean.class);

  // getting injected - see constructor
  private final DotExecutor dotExecutor;
  private final LayerFormatter formatter;
  private final GrappaNodeFactory nodeFactory;
  private final GrappaEdgeFactory edgeFactory;

  private final GraphvizPath graphvizPath;

  private final MinMaxValue minMaxMetricFootprint;
  private final MinMaxValue minMaxMetricHeight;
  private final MinMaxValue minMaxMetricColor;

  private final int dependenciesCount;

  private final Map<Integer, ResultPlatform> resultingGraphList = new ConcurrentHashMap<Integer, ResultPlatform>();

  private final LayoutViewType viewType;

  @Inject
  public SnapshotVisitorBean(final LayerFormatter formatter, final DotExecutor dotExecutor,
    final GrappaNodeFactory nodeFactory, final GrappaEdgeFactory edgeFactory,
    @Assisted final VisualizationSettings settings,
    @Assisted final VisualizationRequest requestDTO,
    @Assisted final VisualizationAdditionalInfos additionalInfos) {

    this.graphvizPath = new GraphvizPath(settings.getDotBinPath(), SystemUtils.IS_OS_WINDOWS);

    this.dotExecutor = dotExecutor;
    this.formatter = formatter;
    this.nodeFactory = nodeFactory;
    this.edgeFactory = edgeFactory;

    this.minMaxMetricFootprint = additionalInfos.getMinMaxMetricFootprint();
    this.minMaxMetricHeight = additionalInfos.getMinMaxMetricHeight();
    this.minMaxMetricColor = additionalInfos.getMinMaxMetricColor();

    this.dependenciesCount = additionalInfos.getDependenciesCount();

    LOGGER.info("minMaxValues for " + requestDTO.getRootSnapshotId() + " : " + minMaxMetricFootprint.toString()
      + " " + minMaxMetricHeight.toString() + " Dependencies: " + this.dependenciesCount);

    this.viewType = requestDTO.getViewType();
  }

  @Override
  public Map<Integer, ResultPlatform> getResultingGraphList() {
    return this.resultingGraphList;
  }

  @Override
  public LayeredLayoutElement visitNode(final TreeNode node, final List<LayeredLayoutElement> elements)
    throws DotExecutorException {

    LOGGER.debug("LayoutVisitor.visitNode " + node.getId() + " " + node.getName());

    // create layout graph
    final Graph inputGraph = createGrappaInputGraph(node, elements);

    // run dot layout for this layer
    final Graph outputGraph = this.dotExecutor.run(inputGraph, this.graphvizPath, this.viewType);

    final ResultPlatform resultPlatform = new ResultPlatform(outputGraph);

    // adjust graph
    this.formatter.format(resultPlatform, node.getDepth(), this.viewType);

    this.resultingGraphList.put(node.getId(), resultPlatform);

    // adjusted graph has a bounding box !
    final GrappaBox bb = resultPlatform.getBoundingBox();

    /**
     * The dot output of the bb is given in DPI. The actual width and height of the representing element has to be
     * scaled back to normal
     */
    final Double width = bb.getWidth() / SoftVis3DConstants.DPI_DOT_SCALE;
    final Double height = bb.getHeight() / SoftVis3DConstants.DPI_DOT_SCALE;

    final double platformHeight = SoftVis3DConstants.PLATFORM_DEFAULT_HEIGHT;

    final HexaColor platformColor = this.formatter.getPlatformBaseColor(node.getDepth());

    /**
     * this will be the representation node of this layer in the upper layer. Currently, the "building" is the
     * deleted if the city view is enabled.
     */
    return LayeredLayoutElement.createLayeredLayoutElement(node, width, height, platformHeight, platformColor);
  }

  private Graph createGrappaInputGraph(final TreeNode node, final List<LayeredLayoutElement> elements) {
    final Graph inputGraph = new Graph(node.getId().toString());

    for (final LayeredLayoutElement element : elements) {
      final Node elementNode = this.nodeFactory.transformToGrappaNode(inputGraph, element);
      inputGraph.addNode(elementNode);
    }

    for (final LayeredLayoutElement element : elements) {
      for (final Edge edge : element.getEdges().values()) {
        inputGraph.addEdge(this.edgeFactory.createGrappaEdge(inputGraph, edge));
      }
    }
    return inputGraph;
  }

  @Override
  public LayeredLayoutElement visitFile(final TreeNode leaf) {
    LOGGER.debug("Leaf : " + leaf.getId() + " " + leaf.getName());

    final boolean isDependencyNode =
      TreeNodeType.DEPENDENCY_GENERATED.equals(leaf.getType())
        && LayoutViewType.DEPENDENCY.equals(this.viewType);

    double sideLength;
    double buildingHeight;

    final HexaColor color;

    if (isDependencyNode) {
      final DependencyTreeNode leafNode = (DependencyTreeNode) leaf;
      final MinMaxValue minMaxDependencies =
        new MinMaxValue(0.0, Integer.valueOf(dependenciesCount).doubleValue());
      sideLength =
        this.formatter.calcSideLength(Integer.valueOf(leafNode.getCounter()).doubleValue(),
          minMaxDependencies);

      buildingHeight = SoftVis3DConstants.LAYER_HEIGHT;

      // not used, will be overriden somewhere
      color = new HexaColor(255, 255, 255);
    } else {
      final ValueTreeNode leafNode = (ValueTreeNode) leaf;
      sideLength = this.formatter.calcSideLength(leafNode.getFootprintMetricValue(), this.minMaxMetricFootprint);

      buildingHeight =
        this.formatter.calcBuildingHeight(leafNode.getHeightMetricValue(), this.minMaxMetricHeight);
      /**
       * building height is in percent with min size. multiplier to get higher buildings in the view.
       */
      buildingHeight = buildingHeight * SoftVis3DConstants.BUILDING_HEIGHT_MULTIPLIER;
      buildingHeight = Math.round(buildingHeight);

      color = this.formatter.getMetricColorColor(leafNode.getColorMetricValue(), this.minMaxMetricColor);
    }

    sideLength = sideLength / SoftVis3DConstants.DPI_DOT_SCALE;

    return LayeredLayoutElement.createLayeredLayoutElement(leaf, sideLength, sideLength, buildingHeight, color);
  }

}
