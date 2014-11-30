/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.layout.bottomUp;

import de.rinderle.softvis3d.domain.graph.ResultPlatform;
import de.rinderle.softvis3d.domain.layout.LayeredLayoutElement;
import de.rinderle.softvis3d.domain.tree.TreeNode;
import de.rinderle.softvis3d.layout.dot.DotExecutorException;

import java.util.List;
import java.util.Map;

public interface SnapshotVisitor {

  Map<Integer, ResultPlatform> getResultingGraphList();

  LayeredLayoutElement visitNode(TreeNode node,
    List<LayeredLayoutElement> elements) throws DotExecutorException;

  LayeredLayoutElement visitFile(TreeNode leaf);

}
