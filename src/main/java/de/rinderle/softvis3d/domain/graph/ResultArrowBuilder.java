/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
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
import de.rinderle.softvis3d.domain.SoftVis3DConstants;
import de.rinderle.softvis3d.layout.helper.HexaColor;

import java.util.ArrayList;
import java.util.List;

public class ResultArrowBuilder {

    private final static HexaColor BLUE = new HexaColor(0, 0, 255);

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
        final String radiusString = edge.getAttributeValue(SoftVis3DConstants.GRAPH_ATTR_EDGE_RADIUS).toString();
        return Double.valueOf(radiusString.substring(1));
    }

    public ResultArrow createResultArrow() {
        return new ResultArrow(this);
    }

}