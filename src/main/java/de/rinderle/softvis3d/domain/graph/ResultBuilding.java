/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
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
package de.rinderle.softvis3d.domain.graph;

import att.grappa.GrappaPoint;
import de.rinderle.softvis3d.domain.tree.TreeNodeType;

import java.util.List;

public class ResultBuilding extends BaseResultObject {

  private final List<ResultArrow> arrows;
  private final int id;
  private final double buildingHeight;
  private double width;
  private double height;

  private final TreeNodeType type;

  private final GrappaPoint position;

  public ResultBuilding(final ResultBuildingBuilder resultBuildingBuilder) {
    this.id = resultBuildingBuilder.id;
    this.arrows = resultBuildingBuilder.arrows;
    this.width = resultBuildingBuilder.width;
    this.height = resultBuildingBuilder.height;

    this.setColor(resultBuildingBuilder.color);

    this.buildingHeight = resultBuildingBuilder.buildingHeight;

    this.type = resultBuildingBuilder.type;

    this.position = resultBuildingBuilder.position;
  }

  public int getId() {
    return id;
  }

  public List<ResultArrow> getArrows() {
    return arrows;
  }

  /**
   * called from view.
   */
  public double getBuildingHeight() {
    return buildingHeight;
  }

  public double getWidth() {
    return width;
  }

  public void setWidth(double width) {
    this.width = this.roundTo2Decimals(width);
  }

  public double getHeight() {
    return height;
  }

  public void setHeight(double height) {
    this.height = this.roundTo2Decimals(height);
  }

  public TreeNodeType getType() {
    return this.type;
  }

  public GrappaPoint getPosition() {
    return this.position;
  }

  private double roundTo2Decimals(final double value) {
    return Math.round(value * 100.0) / 100.0;
  }

}
