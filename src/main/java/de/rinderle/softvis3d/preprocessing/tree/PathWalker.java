/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.preprocessing.tree;

import de.rinderle.softvis3d.domain.sonar.SonarSnapshot;
import de.rinderle.softvis3d.domain.tree.TreeNode;
import de.rinderle.softvis3d.domain.tree.TreeNodeType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;
import java.util.regex.Pattern;

/**
 * This class is used to create a tree out of path
 * information.
 */
public class PathWalker {

  private static final Logger LOGGER = LoggerFactory.getLogger(PathWalker.class);
  private final TreeNode root;
  // TODO: different generated id sequence in ResourceTreeServiceImpl and PathWalker.
  private int generatedIdSequence = Integer.MAX_VALUE - 100000;
  private final Pattern pathSeparator = Pattern.compile("/");

  public PathWalker(final int id) {
    this.root = new TreeNode(id, null, 0, TreeNodeType.TREE, "root", 0, 0);
  }

  public TreeNode getTree() {
    return this.root;
  }

  public void addPath(final SonarSnapshot element) {
    final String[] names = this.pathSeparator.split(element.getPath());
    TreeNode currentNode = this.root;

    boolean isLastIndex;
    for (int i = 0; i < names.length; i = i + 1) {
      isLastIndex = (i == (names.length - 1));
      if (isLastIndex) {
        currentNode = this.getOrCreateChild(currentNode, element.getId(), names[i], TreeNodeType.TREE,
          element.getFootprintMetricValue(), element.getHeightMetricValue());
      } else {
        currentNode = this.getOrCreateGeneratedChild(currentNode, names[i]);
      }
    }
  }

  private int getNextSequence() {
    this.generatedIdSequence = this.generatedIdSequence + 1;
    return this.generatedIdSequence;
  }

  private TreeNode getOrCreateChild(final TreeNode node, Integer id, final String name, final TreeNodeType type,
    final double footprintMetricValue, final double heightMetricValue) {
    final Map<String, TreeNode> children = node.getChildren();
    if (children.containsKey(name)) {
      return children.get(name);
    }

    final TreeNode result = new TreeNode(id, node, node.getDepth() + 1, type, name, footprintMetricValue,
      heightMetricValue);

    children.put(name, result);
    return result;
  }

  private TreeNode getOrCreateGeneratedChild(final TreeNode node, final String name) {
    // generated child nodes do not have any metric values.
    return this.getOrCreateChild(node, this.getNextSequence(), name, TreeNodeType.PATH_GENERATED, 0.0, 0.0);
  }

}
