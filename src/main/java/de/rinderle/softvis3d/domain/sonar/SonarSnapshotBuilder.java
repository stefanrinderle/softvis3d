/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.domain.sonar;

public class SonarSnapshotBuilder {

    public int authorCount;
    int id;
    String path;
    double footprintMetricValue;
    double heightMetricValue;

    public SonarSnapshotBuilder(int id, String path) {
        this.id = id;
        this.path = path;
    }

    public SonarSnapshotBuilder footprintMetricValue(Double footprintMetricValue) {
        if (footprintMetricValue == null) {
            this.footprintMetricValue = 0.0;
        } else {
            this.footprintMetricValue = footprintMetricValue.doubleValue();
        }

        return this;
    }

    public SonarSnapshotBuilder heightMetricValue(Double heightMetricValue) {
        if (heightMetricValue == null) {
            this.footprintMetricValue = 0.0;
        } else {
            this.heightMetricValue = heightMetricValue.doubleValue();
        }

        return this;
    }

    public SonarSnapshotBuilder differentAuthors(int differentAuthors) {
        this.authorCount = differentAuthors;

        return this;
    }

    public SonarSnapshot build() {
        return new SonarSnapshot(this);
    }

}