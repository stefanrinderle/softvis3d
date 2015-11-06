/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
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
package de.rinderle.softvis3d.domain.tree;

public class ValueTreeNode extends TreeNode {

  private final double heightMetricValue;
  private final double footprintMetricValue;
  private final int scmMetricValue;

  public ValueTreeNode(final Integer id, final TreeNode parent, final int depth, final TreeNodeType type,
    final String name, final double footprintMetricValue, final double heightMetricValue, final int scmMetricValue) {
    super(id, parent, depth, type, name);

    this.footprintMetricValue = footprintMetricValue;
    this.heightMetricValue = heightMetricValue;
    this.scmMetricValue = scmMetricValue;
  }

  public double getHeightMetricValue() {
    return this.heightMetricValue;
  }

  public double getFootprintMetricValue() {
    return this.footprintMetricValue;
  }

  public int getScmMetricValue() {
    return scmMetricValue;
  }
}
