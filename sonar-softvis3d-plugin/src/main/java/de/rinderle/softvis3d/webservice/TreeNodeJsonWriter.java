/**
 * SoftVis3D Sonar plugin
 * Copyright (C) 2016 Stefan Rinderle and Yvo Niedrich
 * stefan@rinderle.info / yvo.niedrich@gmail.com
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
package de.rinderle.softvis3d.webservice;

import de.rinderle.softvis3d.domain.tree.RootTreeNode;
import de.rinderle.softvis3d.domain.tree.TreeNode;
import de.rinderle.softvis3d.domain.tree.ValueTreeNode;

import java.util.Map;

public class TreeNodeJsonWriter {

  public void transformRootTreeToJson(final SoftVis3dJsonWriter jsonWriter, final RootTreeNode tree) {
    this.transformTreeToJson(jsonWriter, tree);

    jsonWriter.close();
  }

  private void transformTreeToJson(final SoftVis3dJsonWriter jsonWriter, final TreeNode node) {
    jsonWriter.beginObject();

    jsonWriter.prop("id", node.getId());
    jsonWriter.prop("name", node.getName());
    jsonWriter.prop("isNode", node.isNode());
    addValueTreeNodeValues(jsonWriter, node);

    final TreeNode parent = node.getParent();
    if (parent != null) {
      jsonWriter.prop("parentId", parent.getId());
    }

    this.transformChildren(jsonWriter, node.getChildren());

    jsonWriter.endObject();
  }

  private void addValueTreeNodeValues(final SoftVis3dJsonWriter jsonWriter, final TreeNode node) {
    if (node instanceof ValueTreeNode) {
      final ValueTreeNode valueNode = (ValueTreeNode) node;

      jsonWriter.prop("key", valueNode.getKey());

      jsonWriter.name("measures");
      jsonWriter.beginObject();
      for (final Map.Entry<String, Double> metric : valueNode.getMetrics().entrySet()) {
        jsonWriter.prop(metric.getKey(), metric.getValue());
      }
      jsonWriter.endObject();
    }
  }

  private void transformChildren(final SoftVis3dJsonWriter jsonWriter, final Map<String, TreeNode> children) {
    jsonWriter.name("children");
    jsonWriter.beginArray();

    // first folders
    for (final TreeNode child : children.values()) {
      if (child.isNode()) {
        this.transformTreeToJson(jsonWriter, child);
      }
    }

    // then files
    for (final TreeNode child : children.values()) {
      if (!child.isNode()) {
        this.transformTreeToJson(jsonWriter, child);
      }
    }

    jsonWriter.endArray();
  }

}
