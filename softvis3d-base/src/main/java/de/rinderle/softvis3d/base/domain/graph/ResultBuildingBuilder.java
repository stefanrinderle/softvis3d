/*
 * softvis3d-base
 * Copyright (C) 2015 Stefan Rinderle
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
package de.rinderle.softvis3d.base.domain.graph;

import att.grappa.GrappaConstants;
import att.grappa.GrappaPoint;
import att.grappa.Node;
import de.rinderle.softvis3d.base.domain.LayoutConstants;
import de.rinderle.softvis3d.base.domain.tree.TreeNodeType;
import de.rinderle.softvis3d.base.layout.helper.HexaColor;

public class ResultBuildingBuilder {

  String id;
  int grappaId;

  double buildingHeight;
  double width;
  double height;
  HexaColor color;

  TreeNodeType type;

  GrappaPoint position;

  public ResultBuildingBuilder withNode(final Node node) {
    // TODO why is node.getId() not set right?
    this.id = node.getAttributeValue("id").toString();
    this.grappaId = node.getId();

    this.width = (Double) node.getAttributeValue(GrappaConstants.WIDTH_ATTR);
    this.height = (Double) node.getAttributeValue(GrappaConstants.HEIGHT_ATTR);

    this.color = transformToColor(node.getAttributeValue(LayoutConstants.SOFTVIZ_COLOR));

    this.buildingHeight = transformBuildingHeight(node);

    this.type = transformType(node);

    this.position = (GrappaPoint) node.getAttributeValue(GrappaConstants.POS_ATTR);

    return this;
  }

  private HexaColor transformToColor(final Object attributeValue) {
    return HexaColor.createHexaColorFromHex((String) attributeValue);
  }

  /**
   * As dot gets an exception when the building height attribute is set as a number, we prefix the building height
   * value with "x". This has to be removed in order to parse the value in the view later.
   *
   * TODO: building height does not have to be set for layout calculation. Should be set in PostProcessing.
   */
  private double transformBuildingHeight(final Node node) {
    final String buildingHeightString = (String) node.getAttributeValue(LayoutConstants.GRAPH_ATTR_BUILDING_HEIGHT);
    return Double.valueOf(buildingHeightString.substring(1));
  }

  private TreeNodeType transformType(final Node node) {
    final String typeString = node.getAttributeValue("type").toString();
    return TreeNodeType.valueOf(typeString);
  }

  public ResultBuilding createResultBuilding() {
    return new ResultBuilding(this);
  }

}
