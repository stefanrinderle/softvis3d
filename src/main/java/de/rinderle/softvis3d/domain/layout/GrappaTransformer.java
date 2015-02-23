/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.domain.layout;

import att.grappa.Graph;
import att.grappa.GrappaConstants;
import att.grappa.Node;
import com.google.inject.Inject;
import de.rinderle.softvis3d.domain.SoftVis3DConstants;
import de.rinderle.softvis3d.domain.tree.Edge;
import de.rinderle.softvis3d.layout.format.LayerFormatter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static att.grappa.GrappaConstants.*;

/**
 * This class is not a domain object. The methods should be integrated into
 * LayeredLayoutElement domain object.
 */
public class GrappaTransformer {

  private static final Logger LOGGER = LoggerFactory
          .getLogger(GrappaTransformer.class);

	@Inject
	private LayerFormatter formatter;

	public Node transformToGrappaNode(final Graph inputGraph,
			final LayeredLayoutElement element) {
		final Node elementNode = new Node(inputGraph, element.getName());
		elementNode.setAttribute("id", element.getId().toString());
		elementNode.setAttribute("type", element.getElementType().name());
		elementNode.setAttribute(WIDTH_ATTR,
				this.roundTo2Decimals(element.getWidth()));
		elementNode.setAttribute(HEIGHT_ATTR,
				this.roundTo2Decimals(element.getHeight()));

		// keep the size of the node only dependent on the width and height
		// attribute and not from the node name
		elementNode.setAttribute(LABEL_ATTR, ".");
		elementNode.setAttribute(SHAPE_ATTR, "box");

		elementNode.setAttribute(SoftVis3DConstants.GRAPH_ATTR_BUILDING_HEIGHT,
				element.getBuildingHeight());

    elementNode.setAttribute(SoftVis3DConstants.SOFTVIZ_COLOR, element.getColor().getHex());

		elementNode.setAttribute("displayName", element.getDisplayName());
		return elementNode;
	}

	public att.grappa.Edge transformToGrappaEdge(final Graph inputGraph,
			final Edge edge) {
		final Node sourceNode = this.searchNodeById(inputGraph,
				edge.getSourceId());
		final Node destNode = this.searchNodeById(inputGraph,
				edge.getDestinationId());

		if (sourceNode != null && destNode != null) {
			final att.grappa.Edge result = new att.grappa.Edge(inputGraph,
					sourceNode, destNode);
			final double edgeRadius = this.formatter.calcEdgeRadius(edge
					.getIncludingDependenciesSize());
			result.setAttribute(SoftVis3DConstants.GRAPH_ATTR_EDGE_RADIUS, "x"
					+ edgeRadius);
			result.setAttribute(SoftVis3DConstants.GRAPH_ATTR_PENWIDTH,
					String.valueOf(edge.getIncludingDependenciesSize()));

			return result;
		}

		return null;
	}

	private Node searchNodeById(final Graph inputGraph, final Integer sourceId) {
		for (final Node node : inputGraph.nodeElementsAsArray()) {
			final Integer nodeId = Integer.valueOf((String) node
					.getAttributeValue("id"));
			if (nodeId.equals(sourceId)) {
				return node;
			}
		}

		return null;
	}

	private double roundTo2Decimals(final double value) {
		return Math.round(value * 100.0) / 100.0;
	}

}
