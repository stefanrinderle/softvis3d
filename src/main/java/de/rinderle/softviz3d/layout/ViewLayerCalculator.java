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
import att.grappa.GrappaPoint;
import att.grappa.Node;
import de.rinderle.softviz3d.helper.HexaColor;
import de.rinderle.softviz3d.helper.Point3d;
import de.rinderle.softviz3d.layout.model.LayeredLayoutElement.Type;
import de.rinderle.softviz3d.layout.model.SourceObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static att.grappa.GrappaConstants.POS_ATTR;

public class ViewLayerCalculator {
  private static final Logger LOGGER = LoggerFactory.getLogger(ViewLayerCalculator.class);

  private Graph graph;

  public Graph calculate(Graph graph, SourceObject source) {
    this.graph = graph;

    this.adjustLayoutToX3d(source.getDepth(), source.getIdentifier());

    return this.graph;
  }

  private void adjustLayoutToX3d(Integer depth, Integer snapshotId) {
    this.adjustBb(graph, depth, snapshotId);

    for (Node node : graph.nodeElementsAsArray()) {
      if (node.getAttributeValue("type").toString().equals(Type.NODE.name())) {
        this.adjustNode(node);
      } else if (node.getAttributeValue("type").toString().equals(Type.LEAF.name())) {
        this.adjustLeaf(node);
      } else {
        LOGGER.warn("Unsupported InputElementType");
      }
    }
  }

  private void adjustLeaf(Node node) {
    // TODO SRI calc metric for height

    // $width = $node['attributes']['width'] * LayoutVisitor::$SCALE;
    // !!! METRIC CALCULATION FOR 3D LAYOUT
    /**
     * If only one metric is given, it will be represented by the
     * building volume. Therefore the side length is set in 2D and the
     * same value will be set for the 3D height here. Given 2 Metrics, first is the side length
     * second is the 3D height. Given none, default values.
     */
    // if (array_key_exists('metric1', $node['attributes']) &&
    // array_key_exists('metric2', $node['attributes'])) {
    // $height = round($node['attributes']['metric2'] * LayoutVisitor::$SCALE / 2);
    // } else {
    // $height = $width;
    // }

    // $position = $node['attributes']['pos'];
    // $translation = array($position[0], 0, $position[1]);
    // $size = array('width'=>$width, 'height'=>$height, 'length'=>$width);

    GrappaPoint pos = (GrappaPoint) node.getAttributeValue(POS_ATTR);

    Point3d pos3d = new Point3d(pos.getX(), 0.0, pos.getY());
    double transparency = 0.0;
    HexaColor color = new HexaColor(255, 140, 0);

    node.setAttribute("color", color);
    node.setAttribute("pos3d", pos3d.toString());
    node.setAttribute("transparency", transparency + "");
    // node.setAttribute("height", 20 + "");
  }

  private void adjustNode(Node node) {
    GrappaPoint pos = (GrappaPoint) node.getAttributeValue(POS_ATTR);

    HexaColor color = new HexaColor(0, 0, 0);
    Point3d pos3d = new Point3d(pos.getX(), 0.0, pos.getY());
    double transparency = 0.0;

    node.setAttribute("color", color);
    node.setAttribute("pos3d", pos3d.toString());
    node.setAttribute("transparency", transparency + "");
  }

  private void adjustBb(Graph graph, Integer depth, Integer snapshotId) {
    Point3d pos3d = new Point3d(0.0, 0.0, 0.0);
    double transparency = 0.0;

    // calc color
    int colorCalc = depth * 18;
    if (colorCalc > 155) {
      colorCalc = 155;
    }

    HexaColor color = new HexaColor(100 + colorCalc, 100 + colorCalc, 100 + colorCalc);

    graph.setAttribute("color", color);
    graph.setAttribute("pos3d", pos3d.toString());
    graph.setAttribute("transparency", transparency + "");
  }

}
