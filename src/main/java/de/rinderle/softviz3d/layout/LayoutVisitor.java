package de.rinderle.softviz3d.layout;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.database.model.Snapshot;

import att.grappa.Graph;
import att.grappa.GrappaBox;
import att.grappa.Node;

import de.rinderle.softviz3d.dot.DotExcecutor;
import de.rinderle.softviz3d.dot.DotExcecutorException;
import de.rinderle.softviz3d.layout.model.Element;

public class LayoutVisitor {
	private static final Logger LOGGER = LoggerFactory.getLogger(LayoutVisitor.class);
	
	private static final double SCALE = 72.0;
	private static final double DEFAULT_SIDE_LENGTH = 0.1;
	
//				private $tempDotFile;
//				private $maxMetric1;
//				private $maxMetric2;
//				private $maxCounter;
//				private $maxDependencyCounter;
//				
//				public $layout;
//				
//				function __construct(AbstractView $layout, $projectId) {
//					$this->layout = $layout;
//					$this->tempDotFile = Yii::app()->basePath . Yii::app()->params['tempDotFile'];
//					
//					$params = array(':projectId' => $projectId);
//					
//					$criteria = new CDbCriteria;
//					$criteria->select='MAX(metric1) as maxMetric1';
//					$criteria->condition = 'projectId = :projectId';
//					$criteria->params = $params;
//					$this->maxMetric1 = InputLeaf::model()->find($criteria)->maxMetric1;
//					
//					$criteria = new CDbCriteria;
//					$criteria->select='MAX(metric2) as maxMetric2';
//					$criteria->condition = 'projectId = :projectId';
//					$criteria->params = $params;
//					$this->maxMetric2 = InputLeaf::model()->find($criteria)->maxMetric2;
//					
//					$criteria = new CDbCriteria;
//					$criteria->select='MAX(counter) as maxCounter';
//					$criteria->condition = 'projectId = :projectId';
//					$criteria->params = $params;
//					$this->maxCounter = InputLeaf::model()->find($criteria)->maxCounter;
//					
//					$criteria = new CDbCriteria;
//					$criteria->select='MAX(counter) as maxCounter';
//					$criteria->condition = 'projectId = :projectId';
//					$criteria->params = $params;
//					$this->maxCounter = InputDependency::model()->find($criteria)->maxCounter;
//				}
				
				public Element visitDir(Snapshot snapshot, List<Element> elements) throws DotExcecutorException {
					LOGGER.info("visit dir with count elements: " + elements.size());
					// create layout graph
					Graph inputGraph = new Graph("layerLayout");
					for (Element element : elements) {
						Node elementNode = new Node(inputGraph, element.getIdentifier());
						elementNode.setAttribute("width", element.getWidth());
						elementNode.setAttribute("height", element.getHeight());
						inputGraph.addNode(elementNode);
					}
					
					// run dot layout for this layer
					Graph outputGraph = DotExcecutor.run(inputGraph);
					
					GrappaBox bb = (GrappaBox) outputGraph.getAttributeValue("bb");
					
					// Scale
					Double width = bb.width / SCALE;
					Double height = bb.height / SCALE;
					
					return new Element("layer_" + snapshot.getId(), width, height);
				}

				public Element visitFile(Snapshot snapshot) {
					/**
					 * Leaf interface was only used in dependency view
					 */
					
//			 		if ($comp->type == InputTreeElement::$TYPE_LEAF_INTERFACE) {
//			 			// value between 0 and 1
//			 			// this was to fat: $comp->counter / $this->maxCounter
//			 			//TODO: this should not be possible
//			 			if ($this->maxCounter != 0) {
//			 				$value = ($comp->counter / $this->maxCounter / 2) + 0.1;
//			 				$side = round($value, 2);
//			 			} else {
//			 				$side = 1;
//			 			}
//			 		} else {
//			 			// refactor -> info should be in layout classes
//			 			if ($this->layout instanceof DependencyView) {
//							if ($this->maxCounter != 0) {
//								$value = ($comp->counter / $this->maxCounter) + 0.1;
//								$side = round($value, 2);
//							} else {
//								$side = self::$DEFAULT_SIDE_LENGTH;
//							}
//			 			} else {
//			 				// !!! METRIC CALCULATION FOR 2D LAYOUT
//			 				$metric1 = $comp->metric1;
//			 				$metric2 = $comp->metric2;
//			 				
//			 				/**
//			 				 * If only one metric is given, it will be represented by the
//			 				 * building volume. Therefore the side length is set here and the
//			 				 * same value will be set for the 3D heigth later in the
//			 				 * X3dCalculators. Given 2 Metrics, first is the side length
//			 				 * second is the 3D height. Given none, default values.
//			 				 */
//			 				if ($metric1 && $metric2) {
//			 					$side = round($metric1 / $this->maxMetric1, 2);
//			 				} else  if ($metric1) {
//			 					$side = round($metric1 / $this->maxMetric1, 2);
//			 				} else if ($metric2) {
//			 					$side = round($metric2 / $this->maxMetric2, 2);
//			 				} else {
//			 					$side = self::$DEFAULT_SIDE_LENGTH;
//			 				}
//			 				
//			 				if($side < 0.05) {
//			 					$side = 0.05;
//			 				}
//			 			}
//			 		}
//			 		
//					$comp->proposedSize = array('width' => $side, 'height' => $side);
					return new Element("file_" + snapshot.getId().toString(), DEFAULT_SIDE_LENGTH, DEFAULT_SIDE_LENGTH);
				}
}
