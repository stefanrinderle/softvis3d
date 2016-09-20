/**
 * SoftVis3D Sonar plugin
 * Copyright (C) 2016 Stefan Rinderle and Yvo Niedrich
 * stefan@rinderle.info / yvo.niedrich@gmail.com
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
package de.rinderle.softvis3d.preprocessing.tree;

import de.rinderle.softvis3d.base.domain.tree.RootTreeNode;
import de.rinderle.softvis3d.base.domain.tree.TreeNode;
import de.rinderle.softvis3d.base.domain.tree.TreeNodeType;
import de.rinderle.softvis3d.base.domain.tree.ValueTreeNode;
import de.rinderle.softvis3d.domain.sonar.SonarMeasure;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * This class is used to create a tree out of path information.
 */
public class PathWalker {

  private final RootTreeNode root;
  private final Pattern pathSeparator = Pattern.compile("/");
  private int generatedIdSequence = Integer.MAX_VALUE - 100000;

  PathWalker(final String id) {
    this.root = new RootTreeNode(id);
  }

  public RootTreeNode getTree() {
    return this.root;
  }

  void addPath(final SonarMeasure element) {
    final String[] names = this.pathSeparator.split(element.getPath());

    TreeNode currentNode = this.root;

    boolean isLastIndex;
    for (int i = 0; i < names.length; i = i + 1) {
      isLastIndex = i == (names.length - 1);
      if (isLastIndex) {
        currentNode =
          this.getOrCreateChild(currentNode, element.getId(), names[i], TreeNodeType.TREE,
            element.getFootprintMetricValue(), element.getHeightMetricValue(),
            element.getColorMetricValue());
      } else {
        currentNode = this.getOrCreateGeneratedChild(currentNode, names[i]);
      }
    }
  }

  private String getNextSequence() {
    this.generatedIdSequence = this.generatedIdSequence + 1;
    return String.valueOf(this.generatedIdSequence);
  }

  private TreeNode getOrCreateChild(final TreeNode node, final String id, final String name, final TreeNodeType type,
    final double footprintMetricValue, final double heightMetricValue, final double colorMetricValue) {
    final Map<String, TreeNode> children = node.getChildren();
    if (children.containsKey(name)) {
      return children.get(name);
    }

    final TreeNode result =
      new ValueTreeNode(id, node, node.getDepth() + 1, type, name, footprintMetricValue, heightMetricValue, colorMetricValue);

    node.addChildrenNode(name, result);

    return result;
  }

  private TreeNode getOrCreateGeneratedChild(final TreeNode node, final String name) {
    return this.getOrCreateChild(node, this.getNextSequence(), name, TreeNodeType.PATH_GENERATED, 0, 0, 0);
  }

}
