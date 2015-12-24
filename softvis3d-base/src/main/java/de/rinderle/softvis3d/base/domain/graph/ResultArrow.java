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

import java.util.List;

public class ResultArrow extends BaseResultObject {

  private final String headBuildingId;
  private final String tailBuildingId;
  private final double radius;

  private List<Point3d> linePoints;

  public ResultArrow(final ResultArrowBuilder resultArrowBuilder) {
    this.headBuildingId = resultArrowBuilder.headBuildingId;
    this.tailBuildingId = resultArrowBuilder.tailBuildingId;
    this.radius = resultArrowBuilder.radius;

    this.setColor(resultArrowBuilder.color);

    this.linePoints = resultArrowBuilder.linePoints;
  }

  public String getId() {
    return this.getTailId() + " -> " + getHeadId();
  }

  public String getTailId() {
    return tailBuildingId;
  }

  public String getHeadId() {
    return headBuildingId;
  }

  public double getRadius() {
    return radius;
  }

  public List<Point3d> getLinePoints() {
    return linePoints;
  }

  public void setPoints(final List<Point3d> linePoints) {
    this.linePoints = linePoints;
  }

}
