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
    double footprintMetricValue = 0.0;
    double heightMetricValue = 0.0;

    public SonarSnapshotBuilder(int id) {
        this.id = id;
    }

    public SonarSnapshotBuilder withPath(final String resourcePath) {
        this.path = resourcePath;
        return this;
    }

    public SonarSnapshotBuilder withFootprintMeasure(final Double metricValue) {
        if (metricValue != null) {
            this.footprintMetricValue = metricValue;
        }

        return this;
    }

    public SonarSnapshotBuilder withHeightMeasure(final Double metricValue) {
        if (metricValue != null) {
            this.heightMetricValue = metricValue;
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