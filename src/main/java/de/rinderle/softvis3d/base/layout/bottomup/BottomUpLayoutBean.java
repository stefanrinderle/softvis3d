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
package de.rinderle.softvis3d.base.layout.bottomup;

import de.rinderle.softvis3d.base.domain.SnapshotTreeResult;
import de.rinderle.softvis3d.base.domain.layout.LayeredLayoutElement;
import de.rinderle.softvis3d.base.domain.tree.RootTreeNode;
import de.rinderle.softvis3d.base.domain.tree.TreeNode;
import de.rinderle.softvis3d.base.layout.dot.DotExecutorException;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class BottomUpLayoutBean implements BottomUpLayout {

  private static final Logger LOGGER = LoggerFactory.getLogger(BottomUpLayoutBean.class);

  private final SnapshotVisitor visitor;
  private int maxNodesCount;
  private int currentProcessCount = 0;

  public BottomUpLayoutBean(final SnapshotVisitor visitor) {
    this.visitor = visitor;
  }

  /**
   * Bottom up calculation of layout layers.
   */
  @Override
  public LayeredLayoutElement accept(final SnapshotTreeResult snapshotTreeResult) throws DotExecutorException {

    final RootTreeNode rootTreeNode = snapshotTreeResult.getTree();
    // +1 is the root node
    this.maxNodesCount = rootTreeNode.getAllChildrenNodesSize() + 1;

    return this.accept(snapshotTreeResult.getTree());
  }

  /**
   * Bottom up calculation of layout layers.
   *
   * Package private for testing purposes.
   */
  LayeredLayoutElement accept(final TreeNode rootNode) throws DotExecutorException {

    if (this.currentProcessCount % 10 == 0) {
      LOGGER.info("Processing layout " + this.currentProcessCount + "/" + this.maxNodesCount);
    }

    this.currentProcessCount++;

    final List<LayeredLayoutElement> nodeElements = this.processChildrenNodes(rootNode);
    final List<LayeredLayoutElement> leafElements = this.processChildrenLeaves(rootNode);

    final List<LayeredLayoutElement> layerElements = new ArrayList<LayeredLayoutElement>();
    layerElements.addAll(nodeElements);
    layerElements.addAll(leafElements);

    return visitor.visitNode(rootNode, layerElements);
  }

  /**
   * Package private for testing purposes.
   */
  List<LayeredLayoutElement> processChildrenNodes(final TreeNode node) throws DotExecutorException {

    final List<TreeNode> childrenTreeNodes = node.getChildrenNodes();

    final List<LayeredLayoutElement> layerElements = new ArrayList<LayeredLayoutElement>();

    for (final TreeNode child : childrenTreeNodes) {
      layerElements.add(this.accept(child));
    }

    return layerElements;
  }

  /**
   * Package private for testing purposes.
   */
  List<LayeredLayoutElement> processChildrenLeaves(final TreeNode node) {
    final List<TreeNode> childrenLeaves = node.getChildrenLeaves();

    final List<LayeredLayoutElement> layerElements = new ArrayList<LayeredLayoutElement>();
    for (final TreeNode leaf : childrenLeaves) {
      layerElements.add(visitor.visitFile(leaf));
    }

    return layerElements;
  }

}
