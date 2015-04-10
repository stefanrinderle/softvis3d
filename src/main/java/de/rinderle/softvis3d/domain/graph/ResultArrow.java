/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.domain.graph;

import java.util.List;

public class ResultArrow extends BaseResultObject {

    private final String headBuildingId;
    private final String tailBuildingId;
    private final double radius;

    private List<Point3d> linePoints;

    public ResultArrow(ResultArrowBuilder resultArrowBuilder) {
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
