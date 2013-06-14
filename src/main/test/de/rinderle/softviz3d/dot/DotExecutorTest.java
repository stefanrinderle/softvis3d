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

public class DotExecutorTest extends TestCase {

	private static final Logger LOGGER = LoggerFactory
			.getLogger(DotExecutorTest.class);
	
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
	public void testWholeProcess() {
		try {
			Graph result = DotExcecutor.run(graph);
			
			assertTrue(result.getName().equals(graphName));
			assertTrue(result.subgraphElementsAsArray()[0].getName().equals(subgraphId));
			assertTrue(result.subgraphElementsAsArray()[0].nodeElementsAsArray().length == 1);
			assertTrue(result.nodeElementsAsArray().length == 1);
			
			assertNotNull(result.getAttributeValue("bb"));
			
			StringOutputStream os = new StringOutputStream();
			result.printGraph(os);
			LOGGER.info(os.toString());
			
			LOGGER.info(result.getBoundingBox().toString());
			LOGGER.info(result.getAttributeValue("bb").toString());
		} catch (Exception e) {
			fail(e.getMessage());
		}
		
		assertTrue(true);
	}
	
//	@Test
//	public void testDotParser() throws Exception {
//			StringBuilder builder = new StringBuilder();
//			builder.append("digraph 777 {");
//			builder.append("\n");
//			builder.append("graph [bb=\"0,0,612,600\"];");
//			builder.append("\n");
//				builder.append("subgraph 786 {");
//				builder.append("\n");
//					builder.append("843 [height=\"0.75\",");
//						builder.append("\n");
//						builder.append("metric1=\"29.0\",");
//						builder.append("\n");
//						builder.append("metric2=\"4.0\",");
//						builder.append("\n");
//						builder.append("pos=\"33,378\",");
//						builder.append("\n");
//						builder.append("width=\"0.75\"");
//						builder.append("];");
//						builder.append("\n");
//				builder.append("}");
//				builder.append("\n");
//			builder.append("}");
//			
//			
////			System.out.println(builder.toString());
//			
////			Graph graph = DotExcecutor.run(builder.toString());
//			
//			StringOutputStream output = new StringOutputStream();
//			graph.printGraph(output);
////			System.out.println(output.toString());
//		
//		assertTrue(true);
//	}
}

