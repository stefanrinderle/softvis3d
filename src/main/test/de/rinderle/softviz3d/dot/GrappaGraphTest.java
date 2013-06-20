package de.rinderle.softviz3d.dot;

import java.awt.Color;

import junit.framework.TestCase;

import org.junit.Test;

import att.grappa.Attribute;
import att.grappa.Graph;
import att.grappa.GrappaBox;
import att.grappa.GrappaConstants;
import att.grappa.GrappaPoint;
import att.grappa.Node;
import att.grappa.Subgraph;

public class GrappaGraphTest extends TestCase {

//	private static final Logger LOGGER = LoggerFactory
//			.getLogger(GrappaGraphTest.class);
	
	private Graph graph;
	String graphName = "testgraph";
	String subgraphId = "testsubgraph";
	
	/** digraph testgraph {
	  subgraph testsubgraph {
	    testnode2 [
	      metric2 = 30,
	      metric1 = 15
	    ];
	  }
	  testnode1 [
	    metric2 = 30,
	    metric1 = 15
	  ];
	}
	*/
	@Override
	public void setUp() {
		String graphName = "testgraph";
		boolean directed = true;
		boolean strict = false;

		graph = new Graph(graphName, directed, strict);
		
		Node node1 = new Node(graph, "testnode1");
		node1.setAttribute(new Attribute(GrappaConstants.NODE, "metric1", "15"));
		node1.setAttribute(new Attribute(GrappaConstants.NODE, "metric2", "30"));

		Subgraph subgraph = new Subgraph(graph, subgraphId);
		
		Node node2 = new Node(subgraph, "testnode2");
		node2.setAttribute(new Attribute(GrappaConstants.NODE, "metric1", "15"));
		node2.setAttribute(new Attribute(GrappaConstants.NODE, "metric2", "30"));
		
		graph.addSubgraph(subgraph);
	}

	@Test
	public void testNodeUpdate() {
		//subgraphElementsAsArray()[0]
		
		Subgraph test = graph.subgraphElementsAsArray()[0];
		
		for (Node node : test.nodeElementsAsArray()) {
			node.setAttribute("test", "testValue");
		}
		
		test = graph.subgraphElementsAsArray()[0];
		
		for (Node node : test.nodeElementsAsArray()) {
			assertTrue(node.getAttributeValue("test").equals("testValue"));;
		}
		
		assertTrue(graph.subgraphElementsAsArray()[0].getName().equals(subgraphId));
		assertTrue(graph.subgraphElementsAsArray()[0].nodeElementsAsArray().length == 1);
		assertTrue(graph.nodeElementsAsArray().length == 1);
	}
	
	@Test
	public void testBoundingBoxUpdate() {
		// first create a bounding box - assure that one exists !
		graph.setAttribute("bb", new GrappaBox(0, 0, 0, 0));
		
		// getAttributeValue("bb")
		GrappaBox bb = (GrappaBox) graph.getAttributeValue("bb");
		bb.setRect(2.0, -92.0, 184.09, 92.0);
		
		bb = (GrappaBox) graph.getAttributeValue("bb");
		assertTrue(bb.getX() == 2.0);
		assertTrue(bb.getWidth() == 184.09);
		
//		LOGGER.info(graph.getBoundingBox().toString());
//		LOGGER.info(graph.getAttributeValue("bb").toString());
	}

	@Test
	public void testAttributeTypes() {
		Node node = graph.nodeElementsAsArray()[0];
		
		GrappaPoint pos = (GrappaPoint) node.getAttributeValue("pos");
		
		double[] translation = new double[] {pos.getX(), 0, pos.getY()};
		double transparency = 0.0;
		Color color = new Color(200, 200, 255);
		
		node.setAttribute("color", color);
		node.setAttribute("translation", translation.toString());
		node.setAttribute("transparency", transparency + "");
		node.setAttribute("height", 20 + "");
	}
}
