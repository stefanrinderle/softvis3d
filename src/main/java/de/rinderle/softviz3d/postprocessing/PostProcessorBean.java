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
package de.rinderle.softviz3d.postprocessing;

import att.grappa.GrappaBox;
import att.grappa.GrappaConstants;
import att.grappa.GrappaLine;
import att.grappa.GrappaPoint;
import de.rinderle.softviz3d.domain.LayoutViewType;
import de.rinderle.softviz3d.domain.SnapshotTreeResult;
import de.rinderle.softviz3d.domain.SoftViz3dConstants;
import de.rinderle.softviz3d.domain.graph.ResultArrow;
import de.rinderle.softviz3d.domain.graph.ResultBuilding;
import de.rinderle.softviz3d.domain.graph.ResultPlatform;
import de.rinderle.softviz3d.domain.tree.TreeNode;
import de.rinderle.softviz3d.layout.helper.HexaColor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PostProcessorBean implements PostProcessor {

  private static final Logger LOGGER = LoggerFactory
    .getLogger(PostProcessorBean.class);

  private Map<Integer, ResultPlatform> resultGraphs;

  private Map<Integer, GrappaPoint> innerGraphTranslation;

  private int leafElements;

  @Override
  public int process(final LayoutViewType viewType, final Integer snapshotId,
    final Map<Integer, ResultPlatform> resultGraphs, final SnapshotTreeResult treeResult) {
    this.leafElements = 0;

    this.innerGraphTranslation = new HashMap<Integer, GrappaPoint>();
    this.resultGraphs = resultGraphs;

    this.addTranslationToLayer(treeResult.getTree(), new GrappaPoint(0, 0), viewType);

    return this.leafElements;
  }

  private void addTranslationToLayer(final TreeNode currentNode,
    final GrappaPoint posTranslation,
    final LayoutViewType layoutViewType) {

    LOGGER.debug("addTranslationToLayer" + currentNode.getId() + " " + posTranslation.toString());

    // inputGraphs --> Map<Integer, Graph>
    // Step 1 - search the graph for the source given
    final ResultPlatform platform = this.resultGraphs.get(currentNode.getId());

    // Step 2 - set translation for the graph itself (will be a layer later)
    final GrappaBox translatedBb = this.translatePlatform(platform, posTranslation);

    // Step 3 - for all leaves, just add the parent point3d changes
    this.translateLeaves(posTranslation, platform, translatedBb);

    // Step 4 - for all dirs, call this method (recursive) with the parent + the self changes
    this.translateNodes(currentNode, platform, layoutViewType);
  }

  private void translateNodes(final TreeNode currentNode, final ResultPlatform graph,
    final LayoutViewType layoutViewType) {
    final List<TreeNode> children = currentNode.getChildrenNodes();

    for (final TreeNode child : children) {
      final GrappaPoint pos = this.innerGraphTranslation.get(child.getId());

      this.addTranslationToLayer(child, pos, layoutViewType);

      formatOrDeleteRepresentationNode(graph, layoutViewType, child);
    }
  }

  private void formatOrDeleteRepresentationNode(ResultPlatform graph, LayoutViewType layoutViewType, TreeNode child) {
    if (LayoutViewType.CITY.equals(layoutViewType)) {
      graph.removeNode("dir_" + child.getId());
    } else {
      final ResultBuilding dirNode = graph.findNodeByName("dir_" + child.getId());
      final HexaColor color = new HexaColor(100, 100, 100);
      dirNode.setAttribute(SoftViz3dConstants.GRAPH_ATTR_NODES_COLOR, color.getHex());
      dirNode.setAttribute(SoftViz3dConstants.GRAPH_ATTR_OPACITY, "0.7");
      dirNode.setAttribute(SoftViz3dConstants.GRAPH_ATTR_BUILDING_HEIGHT, "5");
    }
  }

  private void translateLeaves(final GrappaPoint posTranslation, final ResultPlatform graph,
    final GrappaBox translatedBb) {
    GrappaPoint pos;
    double nodeLocationX;
    double nodeLocationY;

    String height3d;

    for (final ResultBuilding leaf : graph.getNodes()) {
      pos = (GrappaPoint) leaf.getAttributeValue(GrappaConstants.POS_ATTR);

      final int id = Integer.valueOf(leaf.getAttributeValue("id").toString());
      this.innerGraphTranslation.put(id, pos);

      // set the position of the node
      nodeLocationX = posTranslation.getX() + pos.getX() - translatedBb.getWidth() / 2;
      nodeLocationY = posTranslation.getY() + pos.getY() + translatedBb.getHeight() / 2;
      pos.setLocation(nodeLocationX, nodeLocationY);

      this.leafElements = this.leafElements + 1;

      height3d = (String) leaf.getAttributeValue("layerHeight3d");

      for (final ResultArrow arrow : leaf.getArrows()) {
        translateArrow(posTranslation, translatedBb, height3d, arrow);
      }
    }

  }

  private void translateArrow(GrappaPoint posTranslation, GrappaBox translatedBb, String height3d, ResultArrow arrow) {
    final GrappaLine line = (GrappaLine) arrow.getAttributeValue(GrappaConstants.POS_ATTR);

    final GrappaPoint[] points = line.getGrappaPoints();
    final GrappaPoint start = points[0];
    final GrappaPoint end = points[points.length - 2];

    arrow.setAttribute("origin", (posTranslation.getX() + start.getX() - translatedBb.getWidth() / 2) +
      "," + height3d
      + "," + (posTranslation.getY() + start.getY() + translatedBb.getHeight() / 2));

    arrow.setAttribute("destination", (posTranslation.getX() + end.getX() - translatedBb.getWidth() / 2) +
      "," + height3d
      + "," + (posTranslation.getY() + end.getY() + translatedBb.getHeight() / 2));
  }

  private GrappaBox translatePlatform(final ResultPlatform platform, final GrappaPoint posTranslation) {
    final GrappaBox bb = (GrappaBox) platform.getAttributeValue("bb");
    final GrappaBox translatedBb = new GrappaBox(posTranslation.getX(), posTranslation.getY(), bb.getWidth(),
      bb.getHeight());
    platform.setAttribute("bb", translatedBb);
    return translatedBb;
  }

}
