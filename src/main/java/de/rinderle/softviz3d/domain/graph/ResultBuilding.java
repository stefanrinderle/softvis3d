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
package de.rinderle.softviz3d.domain.graph;

import att.grappa.Edge;
import att.grappa.GrappaConstants;
import att.grappa.GrappaPoint;
import att.grappa.Node;
import de.rinderle.softviz3d.domain.SoftViz3dConstants;
import de.rinderle.softviz3d.domain.tree.TreeNodeType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

public class ResultBuilding extends BaseResultObject {

  private static final Logger LOGGER = LoggerFactory
    .getLogger(ResultBuilding.class);

  private int id;
  private int grappaId;

  private final List<ResultArrow> arrows;
  private double buildingHeight;
  private double width;
  private double height;

  private TreeNodeType type;

  private static final int MIN_BUILDING_HEIGHT = 10;
  private GrappaPoint position;

  public ResultBuilding(final Node node) {
    // TODO why is node.getId() not set right?
    this.id = Integer.valueOf(node.getAttributeValue("id").toString());
    this.grappaId = node.getId();

    this.arrows = transformEdges(node.edgeElementsAsArray());

    this.width = (Double) node.getAttributeValue(GrappaConstants.WIDTH_ATTR);
    this.height = (Double) node.getAttributeValue(GrappaConstants.HEIGHT_ATTR);

    this.buildingHeight = transformBuildingHeight(node);

    this.type = transformType(node);

    this.position = (GrappaPoint) node.getAttributeValue(GrappaConstants.POS_ATTR);
  }

  public int getId() {
    return id;
  }

  private int getGrappaId() {
    return grappaId;
  }

  public List<ResultArrow> getArrows() {
    return arrows;
  }

  /**
   * Only process the edges which are on the start of the node,
   * otherwise each edge will be processed two times. One for
   * the head and one for the tail.
   */
  private List<ResultArrow> transformEdges(Edge[] inputEdges) {
    List<ResultArrow> result = new ArrayList<ResultArrow>();

    for (int i = 0; i < inputEdges.length; i = i + 1) {
      boolean isTailEnd = inputEdges[i].getTail().getId() == this.getGrappaId();
      if (isTailEnd) {
        result.add(transformEdge(inputEdges[i]));
      }
    }

    return result;
  }

  private ResultArrow transformEdge(Edge edge) {
    return new ResultArrow(edge);
  }

  public void setBuildingHeight(double height) {
    this.buildingHeight = height;
  }

  public double getBuildingHeight() {
    return buildingHeight;
  }

  public void setWidth(double width) {
    this.width = this.roundTo2Decimals(width);
  }

  public double getWidth() {
    return width;
  }

  public void setHeight(double height) {
    this.height = this.roundTo2Decimals(height);
  }

  public double getHeight() {
    return height;
  }

  /**
   * As dot gets an exception when the building height attribute is set as a number,
   * we prefix the building height value with "x". This has to be removed in order to
   * parse the value in the view later.
   *
   * TODO: building height does not have to be set for layout calculation.
   * Should be set in PostProcessing.
   */
  private double transformBuildingHeight(final Node node) {
    String buildingHeightString = (String) node.getAttributeValue(SoftViz3dConstants.GRAPH_ATTR_BUILDING_HEIGHT);
    return Double.valueOf(buildingHeightString.substring(1)) + MIN_BUILDING_HEIGHT;
  }

  private TreeNodeType transformType(final Node node) {
    String typeString = node.getAttributeValue("type").toString();
    return TreeNodeType.valueOf(typeString);
  }

  public TreeNodeType getType() {
    return this.type;
  }

  public GrappaPoint getPosition() {
    return this.position;
  }

}
