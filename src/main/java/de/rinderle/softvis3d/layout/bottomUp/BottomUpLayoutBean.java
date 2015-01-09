/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.layout.bottomUp;

import de.rinderle.softvis3d.domain.SnapshotTreeResult;
import de.rinderle.softvis3d.domain.layout.LayeredLayoutElement;
import de.rinderle.softvis3d.domain.tree.TreeNode;
import de.rinderle.softvis3d.layout.dot.DotExecutorException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

public class BottomUpLayoutBean implements BottomUpLayout {

	private static final Logger LOGGER = LoggerFactory
			.getLogger(BottomUpLayoutBean.class);

	/**
	 * Bottom up calculation of layout layers.
	 */
	public LayeredLayoutElement accept(final SnapshotVisitor visitor,
			final SnapshotTreeResult snapshotTreeResult)
			throws DotExecutorException {

		return this.accept(visitor, snapshotTreeResult.getTree());
	}

	/**
	 * Bottom up calculation of layout layers.
	 */
	private LayeredLayoutElement accept(final SnapshotVisitor visitor,
			final TreeNode rootNode) throws DotExecutorException {

		LOGGER.debug("Layout.accept " + rootNode.getId());

		final List<LayeredLayoutElement> nodeElements = this
				.processChildrenNodes(visitor, rootNode);
		final List<LayeredLayoutElement> leafElements = this
				.processChildrenLeaves(visitor, rootNode);

		final List<LayeredLayoutElement> layerElements = new ArrayList<LayeredLayoutElement>();
		layerElements.addAll(nodeElements);
		layerElements.addAll(leafElements);

		return visitor.visitNode(rootNode, layerElements);
	}

	private List<LayeredLayoutElement> processChildrenNodes(
			final SnapshotVisitor visitor, final TreeNode node)
			throws DotExecutorException {

		final List<TreeNode> childrenTreeNodes = node.getChildrenNodes();

		final List<LayeredLayoutElement> layerElements = new ArrayList<LayeredLayoutElement>();

		for (final TreeNode child : childrenTreeNodes) {
			layerElements.add(this.accept(visitor, child));
		}

		return layerElements;
	}

	private List<LayeredLayoutElement> processChildrenLeaves(
			final SnapshotVisitor visitor, final TreeNode node) {
		final List<TreeNode> childrenLeaves = node.getChildrenLeaves();

		final List<LayeredLayoutElement> layerElements = new ArrayList<LayeredLayoutElement>();
		for (final TreeNode leaf : childrenLeaves) {
			layerElements.add(visitor.visitFile(leaf));
		}

		return layerElements;
	}

}
