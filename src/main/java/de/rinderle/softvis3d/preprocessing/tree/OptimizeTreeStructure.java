/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.preprocessing.tree;

import de.rinderle.softvis3d.domain.tree.TreeNode;

public interface OptimizeTreeStructure {
	void removeUnnecessaryNodes(TreeNode root);
}
