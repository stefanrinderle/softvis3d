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

import att.grappa.GrappaBox;
import att.grappa.GrappaPoint;
import com.google.inject.Inject;
import de.rinderle.softvis3d.domain.LayoutViewType;
import de.rinderle.softvis3d.domain.SnapshotTreeResult;
import de.rinderle.softvis3d.domain.graph.ResultArrow;
import de.rinderle.softvis3d.domain.graph.ResultBuilding;
import de.rinderle.softvis3d.domain.graph.ResultPlatform;
import de.rinderle.softvis3d.domain.tree.TreeNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PostProcessor {

  private static final Logger LOGGER = LoggerFactory.getLogger(PostProcessor.class);

  private Map<Integer, ResultPlatform> resultGraphs;
  private Map<Integer, GrappaPoint> innerGraphTranslation;
  private int leafElements;

  @Inject
  private TranslateArrow translateArrow;

  public int process(final LayoutViewType viewType,
    final Map<Integer, ResultPlatform> resultGraphs, final SnapshotTreeResult treeResult) {
    this.leafElements = 0;

    this.innerGraphTranslation = new HashMap<>();
    this.resultGraphs = resultGraphs;

    this.addTranslationToLayer(treeResult.getTree(), new GrappaPoint(0, 0), viewType);

    return this.leafElements;
  }

  private void addTranslationToLayer(final TreeNode currentNode, final GrappaPoint posTranslation,
    final LayoutViewType layoutViewType) {

    LOGGER.debug("addTranslationToLayer" + currentNode.getId() + " " + posTranslation.toString());

    // inputGraphs --> Map<Integer, Graph>
    // Step 1 - search the graph for the source given
    final ResultPlatform platform = this.resultGraphs.get(currentNode.getId());

    // Step 2 - set translation for the graph itself (will be a layer later)
    final GrappaBox translatedBb = this.translatePlatform(platform, posTranslation);

    // Step 3 - for all leaves, just add the parent point3d changes
    this.translateLeaves(posTranslation, platform, translatedBb);

    // Step 4 - for all dirs, call this method (recursive) with the parent +
    // the self changes
    this.translateNodes(currentNode, platform, layoutViewType);
  }

  private void translateNodes(final TreeNode currentNode, final ResultPlatform graph,
    final LayoutViewType layoutViewType) {
    final List<TreeNode> children = currentNode.getChildrenNodes();

    for (final TreeNode child : children) {
      final GrappaPoint pos = this.innerGraphTranslation.get(child.getId());

      this.addTranslationToLayer(child, pos, layoutViewType);

      removeRepresentationNode(graph, layoutViewType, child);
    }
  }

  private void removeRepresentationNode(ResultPlatform graph, LayoutViewType layoutViewType, TreeNode child) {
    if (LayoutViewType.CITY.equals(layoutViewType)) {
      graph.removeNode(child.getId().toString());
    }
  }

  private void translateLeaves(final GrappaPoint posTranslation, final ResultPlatform graph,
    final GrappaBox translatedBb) {
    GrappaPoint pos;
    double nodeLocationX;
    double nodeLocationY;

    int height3d;

    for (final ResultBuilding leaf : graph.getNodes()) {
      pos = leaf.getPosition();

      this.innerGraphTranslation.put(leaf.getId(), pos);

      // set the position of the node
      nodeLocationX = posTranslation.getX() + pos.getX() - translatedBb.getWidth() / 2;
      nodeLocationY = posTranslation.getY() + pos.getY() + translatedBb.getHeight() / 2;
      pos.setLocation(nodeLocationX, nodeLocationY);

      this.leafElements = this.leafElements + 1;

      height3d = leaf.getHeight3d();

      for (final ResultArrow arrow : leaf.getArrows()) {
        translateArrow.translate(arrow, posTranslation, translatedBb, height3d);
      }
    }

  }

  private GrappaBox translatePlatform(final ResultPlatform platform, final GrappaPoint posTranslation) {
    final GrappaBox bb = platform.getBoundingBox();
    final GrappaBox translatedBb =
      new GrappaBox(posTranslation.getX(), posTranslation.getY(), bb.getWidth(), bb.getHeight());
    platform.setBoundingBox(translatedBb);
    return translatedBb;
  }

}
