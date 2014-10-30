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
package de.rinderle.softviz3d.tree;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;
import java.util.regex.Pattern;

public class PathWalker {
  private static final Logger LOGGER = LoggerFactory
    .getLogger(PathWalker.class);
  private final TreeNode root;
  private int generatedIdSequence = Integer.MAX_VALUE - 100000;
  private Pattern pathSeparator = Pattern.compile("/");

  public PathWalker(int id) {
    root = new TreeNode(id, null, 0, TreeNodeType.TREE, "root", 0, 0);
  }

  public TreeNode getTree() {
    return root;
  }

  public void addPath(int id, String path, double footprintMetricValue, double heightMetricValue) {
    String[] names = pathSeparator.split(path);
    TreeNode currentNode = root;

    boolean isLastIndex;
    for (int i = 0; i < names.length; i++) {
      isLastIndex = (i == (names.length - 1));
      if (isLastIndex) {
        currentNode = getOrCreateChild(currentNode, id, names[i], TreeNodeType.TREE, footprintMetricValue, heightMetricValue);
      } else {
        currentNode = getOrCreateChild(currentNode, generatedIdSequence++, names[i], TreeNodeType.PATH_GENERATED,
          footprintMetricValue, heightMetricValue);
      }
    }
  }

  public int getNextSequence() {
    return generatedIdSequence++;
  }

  private TreeNode getOrCreateChild(TreeNode node, int id, String name, TreeNodeType type, double footprintMetricValue, double heightMetricValue) {
    Map<String, TreeNode> children = node.getChildren();
    if (children.containsKey(name)) {
      return children.get(name);
    }

    TreeNode result = new TreeNode(id, node, node.getDepth() + 1, type, name, footprintMetricValue, heightMetricValue);
    children.put(name, result);
    return result;
  }

}
