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
package de.rinderle.softvis3d.webservice.visualization;

import de.rinderle.softvis3d.domain.tree.Dependency;
import de.rinderle.softvis3d.domain.tree.Edge;
import de.rinderle.softvis3d.domain.tree.RootTreeNode;
import de.rinderle.softvis3d.domain.tree.TreeNode;
import de.rinderle.softvis3d.domain.tree.ValueTreeNode;
import org.sonar.api.utils.text.JsonWriter;

import java.util.List;
import java.util.Map;

public class TreeNodeJsonWriter {

  public void transformRootTreeToJson(final JsonWriter jsonWriter, final RootTreeNode tree) {
    jsonWriter.beginObject();

    jsonWriter.name("treeResult");

    this.transformTreeToJson(jsonWriter, tree);

    jsonWriter.endObject();
  }

  private void transformTreeToJson(final JsonWriter jsonWriter, final TreeNode node) {
    jsonWriter.beginObject();

    jsonWriter.prop("id", node.getId());
    jsonWriter.prop("name", node.getName());
    jsonWriter.prop("isNode", node.isNode());
    optionalTransformMetricValues(jsonWriter, node);

    final TreeNode parent = node.getParent();
    if (parent != null) {
      jsonWriter.name("parentInfo");

      jsonWriter.beginObject();
      jsonWriter.prop("id", parent.getId());
      jsonWriter.prop("name", parent.getName());
      jsonWriter.prop("isNode", parent.isNode());
      optionalTransformMetricValues(jsonWriter, node);
      jsonWriter.endObject();
    }

    this.transformChildren(jsonWriter, node.getChildren());

    this.transformEdges(jsonWriter, node.getEdges());

    if (node instanceof RootTreeNode) {
      this.transformDependencies(jsonWriter, (RootTreeNode) node);
    }

    jsonWriter.endObject();
  }

  private void transformDependencies(final JsonWriter jsonWriter, final RootTreeNode node) {
    jsonWriter.name("dependencies");
    jsonWriter.beginArray();

    for (final Map.Entry<Integer, Dependency> dependencyEntry : node.getSourceDependencies().entrySet()) {
      this.transformDependency(jsonWriter, dependencyEntry.getValue());
    }

    jsonWriter.endArray();
  }

  private void transformDependency(final JsonWriter jsonWriter, final Dependency dependency) {
    jsonWriter.beginObject();
    jsonWriter.prop("id", dependency.getId());
    jsonWriter.prop("sourceId", dependency.getFromNodeId());
    jsonWriter.prop("sourceName", dependency.getFromNodeName());
    jsonWriter.prop("destinationId", dependency.getToNodeId());
    jsonWriter.prop("destinationName", dependency.getToNodeName());
    jsonWriter.endObject();
  }

  private void optionalTransformMetricValues(final JsonWriter jsonWriter, final TreeNode node) {
    if (node instanceof ValueTreeNode) {
      final ValueTreeNode valueNode = (ValueTreeNode) node;
      jsonWriter.prop("heightMetricValue", valueNode.getHeightMetricValue());
      jsonWriter.prop("footprintMetricValue", valueNode.getFootprintMetricValue());
      jsonWriter.prop("authorCount", valueNode.getAuthorCount());
    }
  }

  private void transformEdges(final JsonWriter jsonWriter, final Map<String, Edge> edges) {
    jsonWriter.name("edges");
    jsonWriter.beginArray();

    for (final Edge child : edges.values()) {
      this.transformEdge(jsonWriter, child);
    }

    jsonWriter.endArray();
  }

  private void transformEdge(final JsonWriter jsonWriter, final Edge edge) {
    jsonWriter.beginObject();
    jsonWriter.prop("id", edge.getSourceId() + " -> " + edge.getDestinationId());
    jsonWriter.prop("sourceId", edge.getSourceId());
    jsonWriter.prop("sourceName", edge.getSourceName());
    jsonWriter.prop("destinationId", edge.getDestinationId());
    jsonWriter.prop("destinationName", edge.getDestinationName());

    transformIncludingDependencies(jsonWriter, edge.getIncludingDependencies());

    jsonWriter.endObject();
  }

  private void transformIncludingDependencies(final JsonWriter jsonWriter, final List<Long> includingDependencies) {
    jsonWriter.name("includingDependencies");
    jsonWriter.beginArray();

    for (final Long dependencyId : includingDependencies) {
      jsonWriter.beginObject();
      jsonWriter.prop("id", dependencyId);
      jsonWriter.endObject();
    }

    jsonWriter.endArray();
  }

  private void transformChildren(final JsonWriter jsonWriter, final Map<String, TreeNode> children) {
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
