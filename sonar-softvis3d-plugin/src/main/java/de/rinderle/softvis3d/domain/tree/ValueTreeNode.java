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
package de.rinderle.softvis3d.domain.tree;

import java.util.Map;

public class ValueTreeNode extends TreeNode {

  private final String key;
  private final Map<String, Double> metrics;

  public ValueTreeNode(final String id, final String key, final TreeNode parent, final int depth, final TreeNodeType type,
    final String name, Map<String, Double> metrics) {
    super(id, parent, depth, type, name);

    this.key = key;
    this.metrics = metrics;
  }

  public String getKey() {
    return key;
  }

  public Map<String, Double> getMetrics() {
    return metrics;
  }

}
