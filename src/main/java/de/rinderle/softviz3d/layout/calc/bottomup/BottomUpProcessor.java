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

import com.google.inject.Inject;
import de.rinderle.softviz3d.layout.calc.LayeredLayoutElement;
import de.rinderle.softviz3d.layout.calc.LayoutViewType;
import de.rinderle.softviz3d.layout.dot.DotExcecutorException;
import de.rinderle.softviz3d.tree.ResourceTreeService;
import de.rinderle.softviz3d.tree.TreeNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

public class BottomUpProcessor implements Processor {

  private static final Logger LOGGER = LoggerFactory
    .getLogger(BottomUpProcessor.class);

  @Inject
  private ResourceTreeService resourceTreeService;

  private LayoutViewType viewType;
  private Integer rootSnapshotId;

  /**
   * Bottom up calculation of layout layers.
   */
  public LayeredLayoutElement accept(LayoutViewType viewType, SnapshotVisitor visitor, Integer snapshotId, Integer rootSnapshotId)
    throws DotExcecutorException {
    this.viewType = viewType;
    this.rootSnapshotId = rootSnapshotId;

    return accept(visitor, snapshotId);
  }

  /**
   * Bottom up calculation of layout layers.
   */
  private LayeredLayoutElement accept(SnapshotVisitor visitor, Integer snapshotId)
    throws DotExcecutorException {

    LOGGER.debug("Layout.accept " + snapshotId);

    TreeNode currentNode = resourceTreeService.findNode(viewType, rootSnapshotId, snapshotId);

    List<LayeredLayoutElement> nodeElements = processChildrenNodes(visitor, snapshotId);
    List<LayeredLayoutElement> leafElements = processChildrenLeaves(visitor, snapshotId);

    List<LayeredLayoutElement> layerElements = new ArrayList<LayeredLayoutElement>();
    layerElements.addAll(nodeElements);
    layerElements.addAll(leafElements);

    return visitor.visitNode(currentNode, layerElements);
  }

  private List<LayeredLayoutElement> processChildrenNodes(SnapshotVisitor visitor, Integer snapshotId) throws DotExcecutorException {
    List<TreeNode> childrenTreeNodes = resourceTreeService.getChildrenNodeIds(viewType, rootSnapshotId, snapshotId);

    List<LayeredLayoutElement> layerElements = new ArrayList<LayeredLayoutElement>();

    for (TreeNode node : childrenTreeNodes) {
      layerElements.add(this.accept(visitor, node.getId()));
    }
    return layerElements;
  }

  private List<LayeredLayoutElement> processChildrenLeaves(SnapshotVisitor visitor, Integer snapshotId) {
    List<TreeNode> childrenLeaves = resourceTreeService.getChildrenLeafIds(viewType, rootSnapshotId, snapshotId);

    List<LayeredLayoutElement> layerElements = new ArrayList<LayeredLayoutElement>();
    for (TreeNode leaf : childrenLeaves) {
      layerElements.add(visitor.visitFile(leaf));
    }

    return layerElements;
  }

}
