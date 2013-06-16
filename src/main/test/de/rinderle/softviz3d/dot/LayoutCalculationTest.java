package de.rinderle.softviz3d.dot;

import junit.framework.TestCase;

import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import att.grappa.Attribute;
import att.grappa.Graph;
import att.grappa.GrappaConstants;
import att.grappa.Node;
import att.grappa.Subgraph;

public class LayoutCalculationTest extends TestCase {

	private static final Logger LOGGER = LoggerFactory
			.getLogger(LayoutCalculationTest.class);
	
	private Graph graph;
	String graphName = "testgraph";
	String subgraphId = "testsubgraph";
	
	/** 
	digraph testgraph {
	  subgraph testsubgraph {
	    testnode2 [
	      metric2 = 1,
	      metric1 = 1
	    ];
	  }
	  testnode1 [
	    metric2 = 1,
	    metric1 = 1
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
	public void testWholeProcess() throws DotExcecutorException {
		Graph result = DotExcecutor.run(graph);
		
	}
}

