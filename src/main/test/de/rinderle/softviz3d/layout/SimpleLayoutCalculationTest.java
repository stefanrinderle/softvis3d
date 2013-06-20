package de.rinderle.softviz3d.layout;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import junit.framework.TestCase;

import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import att.grappa.Graph;
import att.grappa.Node;
import de.rinderle.softviz3d.dot.DotExcecutorException;
import de.rinderle.softviz3d.layout.model.LayeredLayoutElement;
import de.rinderle.softviz3d.layout.model.SourceObject;

public class SimpleLayoutCalculationTest extends TestCase {

	private static final Logger LOGGER = LoggerFactory
			.getLogger(SimpleLayoutCalculationTest.class);
	
	/**
	 *      1
	 *     / \
	 *    2   3
	 */
	@Test
	public void testSimpleStructure() throws DotExcecutorException {
		Layout layout = new Layout(new LayoutVisitor());
		
		TestSource leaf2 = new TestSource(2, 1, false, null);
		TestSource leaf3 = new TestSource(3, 1, false, null);

		List<TestSource> children = new ArrayList<SimpleLayoutCalculationTest.TestSource>(); 
		children.add(leaf2);
		children.add(leaf3);
		
		TestSource root = new TestSource(1, 0, true, children);
		
		LayeredLayoutElement result = layout.accept(root);
		
		assertTrue(result.getId() == 1);
	}
	
	@Test 
	public void testVisitorSimpleStructure() throws DotExcecutorException {
		LOGGER.info("START testVisitorSimpleStructure");
		LayoutVisitor visitor = new LayoutVisitor();
		
		Integer resourceId = 1;
		
		TestSource source = new TestSource(resourceId, 0, true, null);
		
		List<LayeredLayoutElement> elements = new ArrayList<LayeredLayoutElement>();
		elements.add(new LayeredLayoutElement(LayeredLayoutElement.Type.LEAF, 2, "zwei", 1.0, 1.0));
		elements.add(new LayeredLayoutElement(LayeredLayoutElement.Type.LEAF, 3, "drei", 1.0, 1.0));
		
		visitor.visitDir(source, elements);
		
		Map<Integer, Graph> result = visitor.getResultingGraphList();
		
		assertNotNull(result);
		assertTrue(result.size() == 1);
		assertTrue(result.containsKey(resourceId));
		
		Graph graph = result.get(resourceId);
		
		for (Node node : graph.nodeElementsAsArray()) {
			assertTrue(node.getAttributeValue("type").toString().equals(LayeredLayoutElement.Type.LEAF.toString()));
		}
		
//		StringOutputStream os = new StringOutputStream();
//		graph.printGraph(os);
//		LOGGER.info(os.toString());
	}
	
	@Test 
	public void testPositioningSimpleStructure() throws DotExcecutorException {
		LOGGER.info("START testVisitorSimpleStructure");
		LayoutVisitor visitor = new LayoutVisitor();
		
		Integer resourceId = 1;
		
		TestSource leaf2 = new TestSource(2, 1, false, null);
		TestSource leaf3 = new TestSource(3, 1, false, null);

		List<TestSource> children = new ArrayList<SimpleLayoutCalculationTest.TestSource>(); 
		children.add(leaf2);
		children.add(leaf3);
		
		TestSource root = new TestSource(resourceId, 0, true, children);
		
		List<LayeredLayoutElement> elements = new ArrayList<LayeredLayoutElement>();
		elements.add(new LayeredLayoutElement(LayeredLayoutElement.Type.LEAF, 2, "zwei", 1.0, 1.0));
		elements.add(new LayeredLayoutElement(LayeredLayoutElement.Type.LEAF, 3, "drei", 1.0, 1.0));
		
		visitor.visitDir(root, elements);
		
		Map<Integer, Graph> inputGraphList = visitor.getResultingGraphList();
		
		AbsolutePositionCalculator calculator = new AbsolutePositionCalculator(inputGraphList);
		calculator.calculate(root);
		
	}
	
	private class TestSource implements SourceObject {

		private Integer id;
		private Integer depth;
		private List<TestSource> children;
		
		private boolean isDir;
		
		public TestSource(Integer id, Integer depth, boolean isDir, List<TestSource> children) {
			super();
			this.id = id;
			this.depth = depth;
			this.isDir = isDir;
			this.children = children;
		}

		public Integer getIdentifier() {
			return this.id;
		}

		public String getName() {
			return this.id + "_name";
		}

		public List<TestSource> getChildrenNodes() {
			List<TestSource> result = new ArrayList<SimpleLayoutCalculationTest.TestSource>();
			
			for (TestSource testSource : children) {
				if (testSource.isDir) {
					result.add(testSource);
				}
			}
			
			return result;
		}

		public List<TestSource> getChildrenLeaves() {
			List<TestSource> result = new ArrayList<SimpleLayoutCalculationTest.TestSource>();
			
			for (TestSource testSource : children) {
				if (!testSource.isDir) {
					result.add(testSource);
				}
			}
			
			return result;
		}

		public List<Integer> getChildrenIds() {
			List<Integer> result = new ArrayList<Integer>();
			
			for (TestSource testSource : children) {
				if (testSource.isDir) {
					result.add(testSource.getIdentifier());
				}
			}
			
			return result;
		}

		public Integer getDepth() {
			return depth;
		}
		
	}
}

