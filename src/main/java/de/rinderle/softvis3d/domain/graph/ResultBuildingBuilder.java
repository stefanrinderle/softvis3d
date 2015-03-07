/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.domain.graph;

import att.grappa.*;
import de.rinderle.softvis3d.domain.SoftVis3DConstants;
import de.rinderle.softvis3d.domain.tree.TreeNodeType;
import de.rinderle.softvis3d.layout.helper.HexaColor;

import java.util.ArrayList;
import java.util.List;

public class ResultBuildingBuilder {

  int id;
  int grappaId;

  List<ResultArrow> arrows;
  double buildingHeight;
  double width;
  double height;
  HexaColor color;

  TreeNodeType type;

  GrappaPoint position;

  public ResultBuildingBuilder withNode(final Node node) {
    // TODO why is node.getId() not set right?
    this.id = Integer.valueOf(node.getAttributeValue("id").toString());
    this.grappaId = node.getId();

    this.arrows = transformEdges(node.edgeElementsAsArray());

    this.width = (Double) node
            .getAttributeValue(GrappaConstants.WIDTH_ATTR);
    this.height = (Double) node
            .getAttributeValue(GrappaConstants.HEIGHT_ATTR);

    this.color = transformToColor(node.getAttributeValue(SoftVis3DConstants.SOFTVIZ_COLOR));

    this.buildingHeight = transformBuildingHeight(node);

    this.type = transformType(node);

    this.position = (GrappaPoint) node
            .getAttributeValue(GrappaConstants.POS_ATTR);

    return this;
  }

  private HexaColor transformToColor(Object attributeValue) {
    return new HexaColor((String) attributeValue);
  }

  /**
   * Only process the edges which are on the start of the node, otherwise each
   * edge will be processed two times. One for the head and one for the tail.
   */
  private List<ResultArrow> transformEdges(Edge[] inputEdges) {
    List<ResultArrow> result = new ArrayList<ResultArrow>();

    for (Edge inputEdge : inputEdges) {
      boolean isTailEnd = inputEdge.getTail().getId() == this.grappaId;
      if (isTailEnd) {
        result.add(transformEdge(inputEdge));
      }
    }

    return result;
  }

  private ResultArrow transformEdge(Edge edge) {
    return new ResultArrowBuilder().withEdge(edge).createResultArrow();
  }

  /**
   * As dot gets an exception when the building height attribute is set as a
   * number, we prefix the building height value with "x". This has to be
   * removed in order to parse the value in the view later.
   *
   * TODO: building height does not have to be set for layout calculation.
   * Should be set in PostProcessing.
   */
  private double transformBuildingHeight(final Node node) {
    String buildingHeightString = (String) node
            .getAttributeValue(SoftVis3DConstants.GRAPH_ATTR_BUILDING_HEIGHT);
    return Double.valueOf(buildingHeightString.substring(1));
  }

  private TreeNodeType transformType(final Node node) {
    String typeString = node.getAttributeValue("type").toString();
    return TreeNodeType.valueOf(typeString);
  }

  public ResultBuilding createResultBuilding() {
    return new ResultBuilding(this);
  }


}