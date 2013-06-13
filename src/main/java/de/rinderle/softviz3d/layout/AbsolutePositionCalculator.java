package de.rinderle.softviz3d.layout;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.resources.Scopes;

import att.grappa.Graph;
import att.grappa.GrappaBox;
import att.grappa.GrappaPoint;
import att.grappa.Node;
import de.rinderle.softviz3d.dao.SnapshotDao;

public class AbsolutePositionCalculator {

	private static final Logger LOGGER = LoggerFactory
	.getLogger(AbsolutePositionCalculator.class);
	
	private SnapshotDao dao;
	private Map<Integer, Graph> inputGraphs;
	private List<Node> outputNodeList;
	
	public AbsolutePositionCalculator(SnapshotDao dao, Map<Integer, Graph> inputGraphList) {
		this.dao = dao;
		this.inputGraphs = inputGraphList;
		this.outputNodeList = new ArrayList<Node>();
	}
	
	public List<Node> calculate(Integer snapshotId) {
		this.addTranslationToLayer(snapshotId, new double [] {0, 0, 0});
		return outputNodeList;
	}

	private void addTranslationToLayer(Integer snapshotId, double[] parentTranslation) {
		Graph graph = inputGraphs.get(snapshotId);

		GrappaBox bb = (GrappaBox) graph.getAttributeValue("bb");
		double[] newTranslation = { parentTranslation[0] + bb.getX(), 0,
				parentTranslation[2] + bb.getY() };

		for (Node node : graph.nodeElementsAsArray()) {
			graph.removeNode(node.getName());
			
			GrappaPoint pos = (GrappaPoint) node.getAttributeValue("pos");
			pos.setLocation(pos.getX() + newTranslation[0], pos.getY()
					+ newTranslation[2]);
			node.setAttribute("pos", pos);

			graph.addNode(node);
			outputNodeList.add(node);
		}

		inputGraphs.put(snapshotId, graph);
		
		List<Integer> children = dao.getChildrenIdsByScope(snapshotId,
				Scopes.DIRECTORY);

		for (Integer key : children) {
			addTranslationToLayer(key, newTranslation);
		}
	}
	
//	private void addTranslationToLayer($rootId, $parentTranslation, $isRoot = false) {
//		$layoutElement = BoxElement::model()->findByAttributes(array('inputTreeElementId'=>$rootId, 'layoutId' => $this->view->layoutId));
//
//		$translation = $layoutElement->getTranslation();
//		$translation[0] = $translation[0] + $parentTranslation[0];
//		$translation[1] = $parentTranslation[1];
//		$translation[2] = $translation[2] + $parentTranslation[2];
//		$layoutElement->saveTranslation($translation);
//		
//		// calculate values for the children nodes
//		// first find the chlidren elements of the input tree 
//		$content = InputTreeElement::model()->findAllByAttributes(array('parentId'=>$layoutElement->inputTreeElementId));
//		foreach ($content as $key => $value) {
//			if ($value->type == InputTreeElement::$TYPE_NODE) {
//				// find the according layout representations
//				$element = BoxElement::model()->findByAttributes(array(
//						'inputTreeElementId'=>$value->id,
//						'layoutId' => $this->view->layoutId,
//						'type'=>BoxElement::$TYPE_FOOTPRINT));
//			
//				$nodePosition = $this->setNewPosition($element, $parentTranslation, $layoutElement);
//				
//				$nodePosition[1] = $nodePosition[1] + $this->view->getLayerMargin();
//				
//				$this->addTranslationToLayer($value->id, $nodePosition);
//			} else {
//				$element = BoxElement::model()->findByAttributes(array(
//						'inputTreeElementId'=>$value->id,
//						'layoutId' => $this->view->layoutId,
//						'type'=>BoxElement::$TYPE_BUILDING));
//
//				// should be not the case after all
//				if ($element) {
//					$nodePosition = $this->setNewPosition($element, $parentTranslation, $layoutElement);
//				}
//			}
//		}
//		
////		$contentEdges = InputDependency::model()->findAllByAttributes(array('parentId' => $layoutElement->inputTreeElementId));
////		foreach ($contentEdges as $key => $value) {
////			$element = EdgeElement::model()->findByAttributes(array(
////							'inputDependencyId'=>$value->id, 
////							'layoutId' => $this->view->layoutId));
////			
////			// should be not the case after all
////			if ($element) {
////				$nodePosition = $this->setNewPosition($element, $parentTranslation, $layoutElement);
////			}
////		}
//	}
//	
//	private function setNewPosition($element, $parentTranslation, $layoutElement) {
//		$size = $layoutElement->getSize();
//		
//		// layout node position
//		$nodePosition = $element->getTranslation();
//		$nodePosition[0] = $nodePosition[0] + $parentTranslation[0] - $size[0] / 2;
//		$nodePosition[1] = $parentTranslation[1];
//		$nodePosition[2] = $nodePosition[2] + $parentTranslation[2] - $size[1] / 2;
//		
//		if ($element instanceof BoxElement) {
//			if ($element->type == BoxElement::$TYPE_BUILDING) {
//				$size = $element->getSize();
//				$nodePosition[1] = $parentTranslation[1] + $size[1] / 2;
//			} else {
//				$nodePosition[1] = $parentTranslation[1];
//			}
//		}
//		
//		$element->saveTranslation($nodePosition);
//		
//		return $nodePosition;
//	}
}
