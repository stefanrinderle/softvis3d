/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.domain.sonar;

public class SonarDependencyBuilder {
    Long id;
    Integer fromSnapshotId;
    Integer toSnapshotId;

    public SonarDependencyBuilder withId(Long id) {
        this.id = id;
        return this;
    }

    public SonarDependencyBuilder withFromSnapshotId(Integer fromSnapshotId) {
        this.fromSnapshotId = fromSnapshotId;
        return this;
    }

    public SonarDependencyBuilder withToSnapshotId(Integer toSnapshotId) {
        this.toSnapshotId = toSnapshotId;
        return this;
    }

    public SonarDependency createSonarDependency() {
        return new SonarDependency(this);
    }
}