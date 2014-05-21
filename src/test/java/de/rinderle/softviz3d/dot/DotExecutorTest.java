/*
 * SoftViz3d Sonar plugin
 * Copyright (C) 2013 Stefan Rinderle
 * stefan@rinderle.info
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
 */
//package de.rinderle.softviz3d.dot;
//
//import org.junit.Ignore;
//
//import org.sonar.api.config.Settings;
//
//import de.rinderle.softviz3d.layout.dot.DotExcecutor;
//
//import de.rinderle.softviz3d.layout.helper.StringOutputStream;
//
//import junit.framework.TestCase;
//
//import org.junit.Test;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//
//
//import att.grappa.Attribute;
//import att.grappa.Graph;
//import att.grappa.GrappaConstants;
//import att.grappa.Node;
//import att.grappa.Subgraph;
//
//
//// reminder
////@com.google.common.annotations.VisibleForTesting
//
//
//
//public class DotExecutorTest extends TestCase {
//
//	private static final Logger LOGGER = LoggerFactory
//			.getLogger(DotExecutorTest.class);
//	
//	private Graph graph;
//	String graphName = "testgraph";
//	String subgraphId = "testsubgraph";
//	
//	/** digraph testgraph {
//	  subgraph testsubgraph {
//	    testnode2 [
//	      metric2 = 30,
//	      metric1 = 15
//	    ];
//	  }
//	  testnode1 [
//	    metric2 = 30,
//	    metric1 = 15
//	  ];
//	}
//	*/
//	@Override
//	public void setUp() {
//		String graphName = "testgraph";
//		boolean directed = true;
//		boolean strict = false;
//
//		graph = new Graph(graphName, directed, strict);
//		
//		Node node1 = new Node(graph, "testnode1");
//		node1.setAttribute(new Attribute(GrappaConstants.NODE, "metric1", "15"));
//		node1.setAttribute(new Attribute(GrappaConstants.NODE, "metric2", "30"));
//
//		Subgraph subgraph = new Subgraph(graph, subgraphId);
//		
//		Node node2 = new Node(subgraph, "testnode2");
//		node2.setAttribute(new Attribute(GrappaConstants.NODE, "metric1", "15"));
//		node2.setAttribute(new Attribute(GrappaConstants.NODE, "metric2", "30"));
//		
//		graph.addSubgraph(subgraph);
//	}
//	
//	@Ignore
//	@Test
//	public void testWholeProcess() {
//		try {
//			Graph result = DotExcecutor.run(graph, new Settings());
//			
//			assertTrue(result.getName().equals(graphName));
//			assertTrue(result.subgraphElementsAsArray()[0].getName().equals(subgraphId));
//			assertTrue(result.subgraphElementsAsArray()[0].nodeElementsAsArray().length == 1);
//			assertTrue(result.nodeElementsAsArray().length == 1);
//			
//			assertNotNull(result.getAttributeValue("bb"));
//			
//			StringOutputStream os = new StringOutputStream();
//			result.printGraph(os);
//			LOGGER.info(os.toString());
//			
//			LOGGER.info(result.getBoundingBox().toString());
//			LOGGER.info(result.getAttributeValue("bb").toString());
//		} catch (Exception e) {
//			fail(e.getMessage());
//		}
//		
//		assertTrue(true);
//	}
//	
////	@Test
////	public void testDotParser() throws Exception {
////			StringBuilder builder = new StringBuilder();
////			builder.append("digraph 777 {");
////			builder.append("\n");
////			builder.append("graph [bb=\"0,0,612,600\"];");
////			builder.append("\n");
////				builder.append("subgraph 786 {");
////				builder.append("\n");
////					builder.append("843 [height=\"0.75\",");
////						builder.append("\n");
////						builder.append("metric1=\"29.0\",");
////						builder.append("\n");
////						builder.append("metric2=\"4.0\",");
////						builder.append("\n");
////						builder.append("pos=\"33,378\",");
////						builder.append("\n");
////						builder.append("width=\"0.75\"");
////						builder.append("];");
////						builder.append("\n");
////				builder.append("}");
////				builder.append("\n");
////			builder.append("}");
////			
////			
//////			System.out.println(builder.toString());
////			
//////			Graph graph = DotExcecutor.run(builder.toString());
////			
////			StringOutputStream output = new StringOutputStream();
////			graph.printGraph(output);
//////			System.out.println(output.toString());
////		
////		assertTrue(true);
////	}
//}
//
