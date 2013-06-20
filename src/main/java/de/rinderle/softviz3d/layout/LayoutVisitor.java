/*
 * SoftViz3d Sonar plugin
 * Copyright (C) 2013 Stefan Rinderle
 * dev@sonar.codehaus.org
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
package de.rinderle.softviz3d.layout;

import att.grappa.Graph;
import att.grappa.GrappaBox;
import att.grappa.Node;
import de.rinderle.softviz3d.dot.DotExcecutor;
import de.rinderle.softviz3d.dot.DotExcecutorException;
import de.rinderle.softviz3d.layout.model.LayeredLayoutElement;
import de.rinderle.softviz3d.layout.model.LayeredLayoutElement.Type;
import de.rinderle.softviz3d.layout.model.SourceObject;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import static att.grappa.GrappaConstants.HEIGHT_ATTR;
import static att.grappa.GrappaConstants.WIDTH_ATTR;

public class LayoutVisitor {
  // private static final Logger LOGGER = LoggerFactory.getLogger(LayoutVisitor.class);

  private ViewLayerCalculator calculator = new ViewLayerCalculator();

  private Map<Integer, Graph> resultingGraphList = new HashMap<Integer, Graph>();

  private static final double SCALE = 72.0;
  private static final double DEFAULT_SIDE_LENGTH = 1;

  public Map<Integer, Graph> getResultingGraphList() {
    return this.resultingGraphList;
  }

  public LayeredLayoutElement visitDir(SourceObject source, List<LayeredLayoutElement> elements)
      throws DotExcecutorException {
    // create layout graph
    Graph inputGraph = new Graph(source.getIdentifier().toString());

    for (LayeredLayoutElement element : elements) {
      Node elementNode = new Node(inputGraph, element.getName());
      elementNode.setAttribute("id", element.getId().toString());
      elementNode.setAttribute("type", element.getElementType().name());
      elementNode.setAttribute(WIDTH_ATTR, element.getWidth());
      elementNode.setAttribute(HEIGHT_ATTR, element.getHeight());
      inputGraph.addNode(elementNode);
    }

    // run dot layout for this layer
    Graph outputGraph = DotExcecutor.run(inputGraph);

    // adjust graph
    Graph adjustedGraph = calculator.calculate(outputGraph, source);
    resultingGraphList.put(source.getIdentifier(), adjustedGraph);

    // adjusted graph has a bounding box !
    GrappaBox bb = (GrappaBox) adjustedGraph.getAttributeValue("bb");

    // Scale
    Double width = bb.getWidth() / SCALE;
    Double height = bb.getHeight() / SCALE;

    return new LayeredLayoutElement(LayeredLayoutElement.Type.NODE, source.getIdentifier(), "dir_" + source.getIdentifier(), width, height);
  }

  public LayeredLayoutElement visitFile(SourceObject source) {
    /**
     * Leaf interface was only used in dependency view
     */

    // if ($comp->type == InputTreeElement::$TYPE_LEAF_INTERFACE) {
    // // value between 0 and 1
    // // this was to fat: $comp->counter / $this->maxCounter
    // //TODO: this should not be possible
    // if ($this->maxCounter != 0) {
    // $value = ($comp->counter / $this->maxCounter / 2) + 0.1;
    // $side = round($value, 2);
    // } else {
    // $side = 1;
    // }
    // } else {
    // // refactor -> info should be in layout classes
    // if ($this->layout instanceof DependencyView) {
    // if ($this->maxCounter != 0) {
    // $value = ($comp->counter / $this->maxCounter) + 0.1;
    // $side = round($value, 2);
    // } else {
    // $side = self::$DEFAULT_SIDE_LENGTH;
    // }
    // } else {
    // // !!! METRIC CALCULATION FOR 2D LAYOUT
    // $metric1 = $comp->metric1;
    // $metric2 = $comp->metric2;
    //
    // /**
    // * If only one metric is given, it will be represented by the
    // * building volume. Therefore the side length is set here and the
    // * same value will be set for the 3D heigth later in the
    // * X3dCalculators. Given 2 Metrics, first is the side length
    // * second is the 3D height. Given none, default values.
    // */
    // if ($metric1 && $metric2) {
    // $side = round($metric1 / $this->maxMetric1, 2);
    // } else if ($metric1) {
    // $side = round($metric1 / $this->maxMetric1, 2);
    // } else if ($metric2) {
    // $side = round($metric2 / $this->maxMetric2, 2);
    // } else {
    // $side = self::$DEFAULT_SIDE_LENGTH;
    // }
    //
    // if($side < 0.05) {
    // $side = 0.05;
    // }
    // }
    // }
    //
    // $comp->proposedSize = array('width' => $side, 'height' => $side);
    return new LayeredLayoutElement(Type.LEAF, source.getIdentifier(), "file_" + source.getIdentifier().toString(),
        DEFAULT_SIDE_LENGTH, DEFAULT_SIDE_LENGTH);
  }
}
