/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.domain.graph;

import att.grappa.Edge;
import att.grappa.GrappaConstants;
import att.grappa.GrappaPoint;
import att.grappa.Node;
import de.rinderle.softvis3d.domain.SoftVis3DConstants;
import de.rinderle.softvis3d.domain.tree.TreeNodeType;
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

  /**
   * called from view.
   */
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
    String buildingHeightString = (String) node.getAttributeValue(SoftVis3DConstants.GRAPH_ATTR_BUILDING_HEIGHT);
    return Double.valueOf(buildingHeightString.substring(1));
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
