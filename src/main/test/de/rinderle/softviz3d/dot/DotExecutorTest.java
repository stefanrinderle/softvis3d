package de.rinderle.softviz3d.dot;
import junit.framework.TestCase;

import org.junit.Test;

import att.grappa.Attribute;
import att.grappa.Graph;
import att.grappa.GrappaConstants;
import att.grappa.Node;
import att.grappa.Subgraph;

public class DotExecutorTest extends TestCase {

	private Graph graph;
	
	@Override
	public void setUp() {
		String graphName = "testgraph";
		boolean directed = true;
		boolean strict = false;

		graph = new Graph(graphName, directed, strict);
		
		String subgraphId = "testsubgraph";
		Subgraph subgraph = new Subgraph(graph, subgraphId);
		graph.addSubgraph(subgraph);
		
		Node node = new Node(subgraph, "testnode");
		node.setAttribute(new Attribute(GrappaConstants.NODE, "metric1", "15"));
		node.setAttribute(new Attribute(GrappaConstants.NODE, "metric2", "30"));

		graph.addNode(node);
	}
	
	@Test
	public void dotBugTest() {
		String testLine = "843 [height=0.75,";
		
		if (testLine.indexOf("height") >= 0) {
			testLine = testLine.replace("height=", "height=\"");
			testLine = testLine.replace(",", "\",");
		}
		
		assertTrue(testLine.equals("843 [height=\"0.75\","));
		
		testLine = "width=0.75";
		
		if (testLine.indexOf("width") >= 0) {
			testLine = testLine.replace("width=", "width=\"");
			testLine = testLine + "\"";
		}
		
		assertTrue(testLine.equals("width=\"0.75\""));
	}
	
	@Test
	public void testWholeProcess() {
		try {
			DotExcecutor.run(graph);
		} catch (Exception e) {
			fail(e.getMessage());
		}
		
		assertTrue(true);
	}
	
	@Test
	public void testDotParser() throws Exception {
			StringBuilder builder = new StringBuilder();
			builder.append("digraph 777 {");
			builder.append("\n");
			builder.append("graph [bb=\"0,0,612,600\"];");
			builder.append("\n");
				builder.append("subgraph 786 {");
				builder.append("\n");
					builder.append("843 [height=\"0.75\",");
						builder.append("\n");
						builder.append("metric1=\"29.0\",");
						builder.append("\n");
						builder.append("metric2=\"4.0\",");
						builder.append("\n");
						builder.append("pos=\"33,378\",");
						builder.append("\n");
						builder.append("width=\"0.75\"");
						builder.append("];");
						builder.append("\n");
				builder.append("}");
				builder.append("\n");
			builder.append("}");
			
			
//			System.out.println(builder.toString());
			
			Graph graph = DotExcecutor.run(builder.toString());
			
			StringOutputStream output = new StringOutputStream();
			graph.printGraph(output);
//			System.out.println(output.toString());
		
		assertTrue(true);
	}
}

