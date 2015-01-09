/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.grappa;

import att.grappa.*;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertTrue;

public class GrappaGraphTest {

	String subgraphId = "testsubgraph";
	private Graph graph;

	/**
	 * digraph testgraph { subgraph testsubgraph { testnode2 [ metric2 = 30,
	 * metric1 = 15 ]; } testnode1 [ metric2 = 30, metric1 = 15 ]; }
	 */
	@Before
	public void setUp() {
		final String graphName = "testgraph";
		final boolean directed = true;
		final boolean strict = false;

		this.graph = new Graph(graphName, directed, strict);

		final Node node1 = new Node(this.graph, "testnode1");
		node1.setAttribute(new Attribute(GrappaConstants.NODE, "metric1", "15"));
		node1.setAttribute(new Attribute(GrappaConstants.NODE, "metric2", "30"));

		final Subgraph subgraph = new Subgraph(this.graph, this.subgraphId);

		final Node node2 = new Node(subgraph, "testnode2");
		node2.setAttribute(new Attribute(GrappaConstants.NODE, "metric1", "15"));
		node2.setAttribute(new Attribute(GrappaConstants.NODE, "metric2", "30"));

		this.graph.addSubgraph(subgraph);
	}

	@Test
	public void testNodeUpdate() {
		// subgraphElementsAsArray()[0]

		Subgraph test = this.graph.subgraphElementsAsArray()[0];

		for (final Node node : test.nodeElementsAsArray()) {
			node.setAttribute("test", "testValue");
		}

		test = this.graph.subgraphElementsAsArray()[0];

		for (final Node node : test.nodeElementsAsArray()) {
			assertTrue(node.getAttributeValue("test").equals("testValue"));
			;
		}

		assertTrue(this.graph.subgraphElementsAsArray()[0].getName().equals(
				this.subgraphId));
		assertTrue(this.graph.subgraphElementsAsArray()[0]
				.nodeElementsAsArray().length == 1);
		assertTrue(this.graph.nodeElementsAsArray().length == 1);
	}

	@Test
	public void testBoundingBoxUpdate() {
		// first create a bounding box - assure that one exists !
		this.graph.setAttribute("bb", new GrappaBox(0, 0, 0, 0));

		// getAttributeValue("bb")
		GrappaBox bb = (GrappaBox) this.graph.getAttributeValue("bb");
		bb.setRect(2.0, -92.0, 184.09, 92.0);

		bb = (GrappaBox) this.graph.getAttributeValue("bb");
		assertTrue(bb.getX() == 2.0);
		assertTrue(bb.getWidth() == 184.09);

	}

	@Test
	public void testAttributeTypes() {
		final Node node = this.graph.nodeElementsAsArray()[0];

		final GrappaPoint pos = (GrappaPoint) node.getAttributeValue("pos");

		final double[] translation = new double[] { pos.getX(), 0, pos.getY() };
		final double opacity = 1.0;

		node.setAttribute("translation", translation.toString());
		// node.setAttribute(SoftVis3DConstants.GRAPH_ATTR_OPACITY, opacity +
		// "");
		node.setAttribute("height", 20 + "");
	}
}
