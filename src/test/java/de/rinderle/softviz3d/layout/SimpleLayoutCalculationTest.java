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
//package de.rinderle.softviz3d.layout;
//
//import org.junit.Ignore;
//
//import att.grappa.Graph;
//import att.grappa.Node;
//import de.rinderle.softviz3d.layout.Layout;
//import de.rinderle.softviz3d.layout.calc.AbsolutePositionCalculator;
//import de.rinderle.softviz3d.layout.calc.LayoutVisitor;
//import de.rinderle.softviz3d.layout.dot.DotExcecutorException;
//import de.rinderle.softviz3d.layout.helper.LayeredLayoutElement;
//import de.rinderle.softviz3d.layout.interfaces.SourceMetric;
//import de.rinderle.softviz3d.layout.interfaces.SourceObject;
//import junit.framework.TestCase;
//import org.junit.Test;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.sonar.api.config.Settings;
//
//import java.util.ArrayList;
//import java.util.List;
//import java.util.Map;
//
//public class SimpleLayoutCalculationTest extends TestCase {
//
//	private static final Logger LOGGER = LoggerFactory
//			.getLogger(SimpleLayoutCalculationTest.class);
//	
//	/**
//	 *      1
//	 *     / \
//	 *    2   3
//	 */
//	@Test
//	@Ignore
//	public void testSimpleStructure() throws DotExcecutorException {
//		Layout layout = new Layout(new LayoutVisitor(new Settings(), new SourceMetric() {
//      
//      @Override
//      public Double getMinValue() {
//        return 0.0;
//      }
//      
//      @Override
//      public Double getMaxValue() {
//        return 100.0;
//      }
//    }, new SourceMetric() {
//      
//      @Override
//      public Double getMinValue() {
//        return 5.0;
//      }
//      
//      @Override
//      public Double getMaxValue() {
//        return 100.0;
//      }
//    }));
//		
//		TestSource leaf2 = new TestSource(2, 1, false, null);
//		TestSource leaf3 = new TestSource(3, 1, false, null);
//
//		List<TestSource> children = new ArrayList<SimpleLayoutCalculationTest.TestSource>(); 
//		children.add(leaf2);
//		children.add(leaf3);
//		
//		TestSource root = new TestSource(1, 0, true, children);
//		
//		LayeredLayoutElement result = layout.accept(root);
//		
//		assertTrue(result.getId() == 1);
//	}
//	
//	@Test 
//	@Ignore
//	public void testVisitorSimpleStructure() throws DotExcecutorException {
//		LOGGER.info("START testVisitorSimpleStructure");
//		LayoutVisitor visitor = new LayoutVisitor(new Settings(), new SourceMetric() {
//      
//      @Override
//      public Double getMinValue() {
//        return 0.0;
//      }
//      
//      @Override
//      public Double getMaxValue() {
//        return 100.0;
//      }
//    }, new SourceMetric() {
//      
//      @Override
//      public Double getMinValue() {
//        return 5.0;
//      }
//      
//      @Override
//      public Double getMaxValue() {
//        return 100.0;
//      }
//    });
//		
//		Integer resourceId = 1;
//		
//		TestSource source = new TestSource(resourceId, 0, true, null);
//		
//		List<LayeredLayoutElement> elements = new ArrayList<LayeredLayoutElement>();
//		elements.add(new LayeredLayoutElement(LayeredLayoutElement.Type.LEAF, 2, "zwei", 1.0, 1.0, null, "fName"));
//		elements.add(new LayeredLayoutElement(LayeredLayoutElement.Type.LEAF, 3, "drei", 1.0, 1.0, null, "fName"));
//		
//		visitor.visitNode(source, elements);
//		
//		Map<Integer, Graph> result = visitor.getResultingGraphList();
//		
//		assertNotNull(result);
//		assertTrue(result.size() == 1);
//		assertTrue(result.containsKey(resourceId));
//		
//		Graph graph = result.get(resourceId);
//		
//		for (Node node : graph.nodeElementsAsArray()) {
//			assertTrue(node.getAttributeValue("type").toString().equals(LayeredLayoutElement.Type.LEAF.toString()));
//		}
//		
////		StringOutputStream os = new StringOutputStream();
////		graph.printGraph(os);
////		LOGGER.info(os.toString());
//	}
//	
//	@Test 
//	@Ignore
//	public void testPositioningSimpleStructure() throws DotExcecutorException {
//		LOGGER.info("START testVisitorSimpleStructure");
//		LayoutVisitor visitor = new LayoutVisitor(new Settings(), new SourceMetric() {
//      
//      @Override
//      public Double getMinValue() {
//        return 0.0;
//      }
//      
//      @Override
//      public Double getMaxValue() {
//        return 100.0;
//      }
//    }, new SourceMetric() {
//      
//      @Override
//      public Double getMinValue() {
//        return 5.0;
//      }
//      
//      @Override
//      public Double getMaxValue() {
//        return 100.0;
//      }
//    });
//		
//		Integer resourceId = 1;
//		
//		TestSource leaf2 = new TestSource(2, 1, false, null);
//		TestSource leaf3 = new TestSource(3, 1, false, null);
//
//		List<TestSource> children = new ArrayList<SimpleLayoutCalculationTest.TestSource>(); 
//		children.add(leaf2);
//		children.add(leaf3);
//		
//		TestSource root = new TestSource(resourceId, 0, true, children);
//		
//		List<LayeredLayoutElement> elements = new ArrayList<LayeredLayoutElement>();
//		elements.add(new LayeredLayoutElement(LayeredLayoutElement.Type.LEAF, 2, "zwei", 1.0, 1.0, null, "fName"));
//		elements.add(new LayeredLayoutElement(LayeredLayoutElement.Type.LEAF, 3, "drei", 1.0, 1.0, null, "fName"));
//		
//		visitor.visitNode(root, elements);
//		
//		Map<Integer, Graph> inputGraphList = visitor.getResultingGraphList();
//		
//		AbsolutePositionCalculator calculator = new AbsolutePositionCalculator(inputGraphList);
//		calculator.calculate(root);
//		
//	}
//	
//	private class TestSource implements SourceObject {
//
//		private Integer id;
//		private Integer depth;
//		private List<TestSource> children;
//		
//		private boolean isDir;
//		
//		public TestSource(Integer id, Integer depth, boolean isDir, List<TestSource> children) {
//			super();
//			this.id = id;
//			this.depth = depth;
//			this.isDir = isDir;
//			this.children = children;
//		}
//
//		public Integer getId() {
//			return this.id;
//		}
//
//		public String getName() {
//			return this.id + "_name";
//		}
//
//		public List<TestSource> getChildrenNodes() {
//			List<TestSource> result = new ArrayList<SimpleLayoutCalculationTest.TestSource>();
//			
//			for (TestSource testSource : children) {
//				if (testSource.isDir) {
//					result.add(testSource);
//				}
//			}
//			
//			return result;
//		}
//
//		public List<TestSource> getChildrenLeaves() {
//			List<TestSource> result = new ArrayList<SimpleLayoutCalculationTest.TestSource>();
//			
//			for (TestSource testSource : children) {
//				if (!testSource.isDir) {
//					result.add(testSource);
//				}
//			}
//			
//			return result;
//		}
//
//		public List<Integer> getChildrenIds() {
//			List<Integer> result = new ArrayList<Integer>();
//			
//			for (TestSource testSource : children) {
//				if (testSource.isDir) {
//					result.add(testSource.getId());
//				}
//			}
//			
//			return result;
//		}
//
//		public Integer getDepth() {
//			return depth;
//		}
//
//		@Override
//	  public Double getMetricFootprintValue() {
//	    return Math.random() * 10;
//	  }
//
//	  @Override
//	  public Double getMetricHeightValue() {
//	    return Math.random() * 10;
//	  }
//		
//	}
//}
//
