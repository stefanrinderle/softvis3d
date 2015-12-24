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

import att.grappa.Edge;
import att.grappa.GrappaConstants;
import att.grappa.GrappaLine;
import att.grappa.GrappaPoint;
import de.rinderle.softvis3d.base.domain.LayoutConstants;
import de.rinderle.softvis3d.base.layout.helper.HexaColor;
import java.util.ArrayList;
import java.util.List;

public class ResultArrowBuilder {

  private static final HexaColor BLUE = new HexaColor(0, 0, 255);

  String headBuildingId;
  String tailBuildingId;
  double radius;
  HexaColor color;

  List<Point3d> linePoints;

  public ResultArrowBuilder withEdge(final Edge edge) {
    this.headBuildingId = edge.getHead().getName();
    this.tailBuildingId = edge.getTail().getName();

    this.radius = transformEdgeRadius(edge);

    transformEdgeLine(edge);

    this.color = BLUE;

    return this;
  }

  /**
   * Last point is removed. Why? Check the docu one more time, but the last point is never in the path. Example:
   *
   * TODO: check docu what the last point means.
   *
   * pos="e456.310000,259.080000 433.570000,337.670000 440.430000,313.980000 447.170000,290.670000
   *      453.520000,268.730000 "];
   *
   * @param edge
   */
  private void transformEdgeLine(final Edge edge) {
    final GrappaLine line = (GrappaLine) edge.getAttributeValue(GrappaConstants.POS_ATTR);

    final GrappaPoint[] points = line.getGrappaPoints();

    linePoints = new ArrayList<>();
    for (int i = 0; i < points.length - 1; i++) {
      final Point3d point = new Point3d(points[i].x, 0, points[i].y);
      linePoints.add(point);
    }
  }

  private double transformEdgeRadius(final Edge edge) {
    final String radiusString = edge.getAttributeValue(LayoutConstants.GRAPH_ATTR_EDGE_RADIUS).toString();
    return Double.valueOf(radiusString.substring(1));
  }

  public ResultArrow createResultArrow() {
    return new ResultArrow(this);
  }

}
