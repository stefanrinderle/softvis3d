/*
 * softvis3d-base
 * Copyright (C) 2015 Stefan Rinderle
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
package de.rinderle.softvis3d.base.domain.tree;

public class Dependency {

  private final Long id;
  private final Integer fromNodeId;
  private final String fromNodeName;
  private final Integer toNodeId;
  private final String toNodeName;

  public Dependency(final Long id, final Integer fromNodeId, final String fromNodeName,
    final Integer toNodeId, final String toNodeName) {
    this.id = id;
    this.fromNodeId = fromNodeId;
    this.fromNodeName = fromNodeName;
    this.toNodeId = toNodeId;
    this.toNodeName = toNodeName;
  }

  public Long getId() {
    return id;
  }

  public Integer getFromNodeId() {
    return fromNodeId;
  }

  public String getFromNodeName() {
    return fromNodeName;
  }

  public Integer getToNodeId() {
    return toNodeId;
  }

  public String getToNodeName() {
    return toNodeName;
  }
}
