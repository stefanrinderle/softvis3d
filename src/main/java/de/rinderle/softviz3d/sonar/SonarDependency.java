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
public class SonarDependency {

  private BigInteger id;
  private Integer fromSnapshotId;
  private Integer fromResouorceId;
  private Integer toSnapshotId;
  private Integer toResourceId;
  private String usage;
  private Integer weight;
  private String fromScope;
  private String toScope;

  public SonarDependency() {
  }

  public BigInteger getId() {
    return id;
  }

  public void setId(final BigInteger id) {
    this.id = id;
  }

  public Integer getFromSnapshotId() {
    return fromSnapshotId;
  }

  public void setFromSnapshotId(final Integer fromSnapshotId) {
    this.fromSnapshotId = fromSnapshotId;
  }

  public Integer getFromResouorceId() {
    return fromResouorceId;
  }

  public void setFromResouorceId(final Integer fromResouorceId) {
    this.fromResouorceId = fromResouorceId;
  }

  public Integer getToSnapshotId() {
    return toSnapshotId;
  }

  public void setToSnapshotId(final Integer toSnapshotId) {
    this.toSnapshotId = toSnapshotId;
  }

  public Integer getToResourceId() {
    return toResourceId;
  }

  public void setToResourceId(final Integer toResourceId) {
    this.toResourceId = toResourceId;
  }

  public String getUsage() {
    return usage;
  }

  public void setUsage(final String usage) {
    this.usage = usage;
  }

  public Integer getWeight() {
    return weight;
  }

  public void setWeight(final Integer weight) {
    this.weight = weight;
  }

  public String getFromScope() {
    return fromScope;
  }

  public void setFromScope(final String fromScope) {
    this.fromScope = fromScope;
  }

  public String getToScope() {
    return toScope;
  }

  public void setToScope(final String toScope) {
    this.toScope = toScope;
  }

  @Override
  public String toString() {
    return "SonarDependency{" +
      "id=" + id +
      ", fromSnapshotId=" + fromSnapshotId +
      ", fromResouorceId=" + fromResouorceId +
      ", toSnapshotId=" + toSnapshotId +
      ", toResourceId=" + toResourceId +
      ", usage='" + usage + '\'' +
      ", weight=" + weight +
      ", fromScope='" + fromScope + '\'' +
      ", toScope='" + toScope + '\'' +
      '}';
  }

}
