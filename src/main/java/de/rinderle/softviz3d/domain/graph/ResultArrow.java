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
import att.grappa.GrappaLine;
import att.grappa.GrappaPoint;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ResultArrow extends BaseResultObject {

  private static final Logger LOGGER = LoggerFactory
    .getLogger(ResultArrow.class);

  private final String headBuildingId;
  private final String tailBuildingId;
  private final double radius;
  private Point3d origin;
  private Point3d destination;

  private GrappaPoint start;
  private GrappaPoint end;

  public ResultArrow(Edge edge) {
    this.headBuildingId = edge.getHead().getName();
    this.tailBuildingId = edge.getTail().getName();

    this.radius = transformEdgeRadius(edge);

    transformEdgeLine(edge);
  }

  private void transformEdgeLine(Edge edge) {
    GrappaLine line = (GrappaLine) edge.getAttributeValue(GrappaConstants.POS_ATTR);

    final GrappaPoint[] points = line.getGrappaPoints();
    start = points[0];
    end = points[points.length - 2];
  }

  private double transformEdgeRadius(final Edge edge) {
    final String radiusString = edge.getAttributeValue("edgeRadius").toString();
    return Double.valueOf(radiusString.substring(1));
  }

  /**
   * used by view.
   */
  public String getTailId() {
    return tailBuildingId;
  }

  /**
   * used by view.
   */
  public String getHeadId() {
    return headBuildingId;
  }

  public void setOrigin(Point3d origin) {
    this.origin = origin;
  }

  /**
   * Used by view.
   */
  public Point3d getOrigin() {
    return origin;
  }

  public void setDestination(Point3d destination) {
    this.destination = destination;
  }

  /**
   * Used by view.
   */
  public Point3d getDestination() {
    return destination;
  }

  /**
   * Used by view.
   */
  public double getRadius() {
    return radius;
  }

  public GrappaPoint getStart() {
    return start;
  }

  public GrappaPoint getEnd() {
    return end;
  }
}
