/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
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

    this.setColor(calculateColor(edge));
  }

  private HexaColor calculateColor(final Edge edge) {
    final TreeNodeType typeHead = transformNodeType(edge.getHead());
    final TreeNodeType typeTail = transformNodeType(edge.getTail());

    if (TreeNodeType.DEPENDENCY_GENERATED.equals(typeTail)) {
      // BLUE
      return new HexaColor(0, 0, 255);
    } else if (TreeNodeType.DEPENDENCY_GENERATED.equals(typeHead)) {
      // RED
      return new HexaColor(255, 0, 0);
    } else {
      return SoftVis3DConstants.BUILDING_COLOR;
    }
  }

  private TreeNodeType transformNodeType(final Node node) {
    String typeString = node.getAttributeValue("type").toString();
    return TreeNodeType.valueOf(typeString);
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
