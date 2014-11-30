/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.domain.sonar;

import java.math.BigInteger;

public class SonarDependency {

  private BigInteger id;
  private Integer fromSnapshotId;
  private Integer fromResourceId;
  private Integer toSnapshotId;
  private Integer toResourceId;
  private String usage;
  private Integer weight;
  private String fromScope;
  private String toScope;

  public BigInteger getId() {
    return this.id;
  }

  public void setId(final BigInteger id) {
    this.id = id;
  }

  public Integer getFromSnapshotId() {
    return this.fromSnapshotId;
  }

  public void setFromSnapshotId(final Integer fromSnapshotId) {
    this.fromSnapshotId = fromSnapshotId;
  }

  public Integer getFromResourceId() {
    return this.fromResourceId;
  }

  public void setFromResourceId(final Integer fromResourceId) {
    this.fromResourceId = fromResourceId;
  }

  public Integer getToSnapshotId() {
    return this.toSnapshotId;
  }

  public void setToSnapshotId(final Integer toSnapshotId) {
    this.toSnapshotId = toSnapshotId;
  }

  public Integer getToResourceId() {
    return this.toResourceId;
  }

  public void setToResourceId(final Integer toResourceId) {
    this.toResourceId = toResourceId;
  }

  public String getUsage() {
    return this.usage;
  }

  public void setUsage(final String usage) {
    this.usage = usage;
  }

  public Integer getWeight() {
    return this.weight;
  }

  public void setWeight(final Integer weight) {
    this.weight = weight;
  }

  public String getFromScope() {
    return this.fromScope;
  }

  public void setFromScope(final String fromScope) {
    this.fromScope = fromScope;
  }

  public String getToScope() {
    return this.toScope;
  }

  public void setToScope(final String toScope) {
    this.toScope = toScope;
  }

  @Override
  public String toString() {
    return "SonarDependency{" +
      "id=" + this.id +
      ", fromSnapshotId=" + this.fromSnapshotId +
      ", fromResourceId=" + this.fromResourceId +
      ", toSnapshotId=" + this.toSnapshotId +
      ", toResourceId=" + this.toResourceId +
      ", usage='" + this.usage + '\'' +
      ", weight=" + this.weight +
      ", fromScope='" + this.fromScope + '\'' +
      ", toScope='" + this.toScope + '\'' +
      '}';
  }

}
