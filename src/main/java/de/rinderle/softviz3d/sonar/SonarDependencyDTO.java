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
package de.rinderle.softviz3d.sonar;

import java.math.BigInteger;

/**
 * Created by srinderle on 26.09.14.
 */
public class SonarDependencyDTO {

  private BigInteger id;
  private Integer fromSnapshotId;
  private Integer fromResourceId;
  private Integer toSnapshotId;
  private Integer toResourceId;
  private String usage;
  private Integer weight;
  private String fromScope;
  private String toScope;

  public SonarDependencyDTO() {
  }

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
