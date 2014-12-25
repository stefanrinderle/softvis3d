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
import att.grappa.GrappaLine;
import att.grappa.GrappaPoint;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

public class ResultArrow extends BaseResultObject {

  private static final Logger LOGGER = LoggerFactory
    .getLogger(ResultArrow.class);

  private final String headBuildingId;
  private final String tailBuildingId;
  private final double radius;

  private List<Point3d> linePoints;

  public ResultArrow(Edge edge) {
    this.headBuildingId = edge.getHead().getName();
    this.tailBuildingId = edge.getTail().getName();

    this.radius = transformEdgeRadius(edge);

    transformEdgeLine(edge);
  }

  private void transformEdgeLine(Edge edge) {
    GrappaLine line = (GrappaLine) edge.getAttributeValue(GrappaConstants.POS_ATTR);

    final GrappaPoint[] points = line.getGrappaPoints();

    linePoints = new ArrayList<Point3d>();
    for (int i = 0; i < points.length - 1; i++) {
      final Point3d point = new Point3d(points[i].x, 0, points[i].y);
      linePoints.add(point);
    }
  }

  private double transformEdgeRadius(final Edge edge) {
    final String radiusString = edge.getAttributeValue("edgeRadius").toString();
    return Double.valueOf(radiusString.substring(1));
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

}
