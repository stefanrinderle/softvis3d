/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.domain.tree;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

public class RootTreeNode extends TreeNode {

  private static final Logger LOGGER = LoggerFactory.getLogger(RootTreeNode.class);

  private Map<Integer, Dependency> sourceDependencies = new HashMap<Integer, Dependency>();

  public RootTreeNode(final Integer id) {
    super(id, null, 0, TreeNodeType.TREE, "root");
  }

  public Map<Integer, Dependency> getSourceDependencies() {
    return sourceDependencies;
  }

  public void addDependency(Dependency treeDependency) {
    sourceDependencies.put(treeDependency.getId().intValue(), treeDependency);
  }
}
