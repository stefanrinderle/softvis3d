/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.domain.sonar;

public class SonarDependency {

    private Long id;
    private Integer fromSnapshotId;
    private Integer toSnapshotId;

    public SonarDependency(final SonarDependencyBuilder sonarDependencyBuilder) {
        this.id = sonarDependencyBuilder.id;
        this.fromSnapshotId = sonarDependencyBuilder.fromSnapshotId;
        this.toSnapshotId = sonarDependencyBuilder.toSnapshotId;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(final Long id) {
        this.id = id;
    }

    public Integer getFromSnapshotId() {
        return this.fromSnapshotId;
    }

    public Integer getToSnapshotId() {
        return this.toSnapshotId;
    }

    @Override
    public String toString() {
        return "SonarDependency{" + "id=" + id + ", fromSnapshotId=" + fromSnapshotId + ", toSnapshotId='"
                + toSnapshotId + '\'' + '}';
    }

}
