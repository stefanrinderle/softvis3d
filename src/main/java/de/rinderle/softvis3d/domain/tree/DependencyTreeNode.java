/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.domain.tree;

public class DependencyTreeNode extends TreeNode {

	private int counter = 1;

	public DependencyTreeNode(final Integer id, final TreeNode parent,
			final int depth) {
		super(id, parent, depth, TreeNodeType.DEPENDENCY_GENERATED,
				"elevatorNode_" + id);
	}

	public void increaseCounter() {
		this.counter++;
	}

	public int getCounter() {
		return counter;
	}
}
