/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.webservice.tree;

import de.rinderle.softvis3d.domain.tree.*;
import org.sonar.api.server.ws.Response;
import org.sonar.api.utils.text.JsonWriter;

import java.math.BigInteger;
import java.util.List;
import java.util.Map;

public class TreeNodeJsonWriterImpl implements TreeNodeJsonWriter {

  @Override
  public void transformTreeToJson(final Response response, final RootTreeNode tree) {
    final JsonWriter jsonWriter = response.newJsonWriter();

    this.transformTreeToJson(jsonWriter, tree);

    jsonWriter.close();
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

  private void transformDependencies(JsonWriter jsonWriter, RootTreeNode node) {
    jsonWriter.name("dependencies");
    jsonWriter.beginArray();

    for (final Map.Entry<Integer, Dependency> dependencyEntry : node.getSourceDependencies().entrySet()) {
      this.transformDependency(jsonWriter, dependencyEntry.getValue());
    }

    jsonWriter.endArray();
  }

  private void transformDependency(JsonWriter jsonWriter, Dependency dependency) {
    jsonWriter.beginObject();
    jsonWriter.prop("id", dependency.getId());
    jsonWriter.prop("sourceId", dependency.getFromNodeId());
    jsonWriter.prop("sourceName", dependency.getFromNodeName());
    jsonWriter.prop("destinationId", dependency.getToNodeId());
    jsonWriter.prop("destinationName", dependency.getToNodeName());
    jsonWriter.endObject();
  }

  private void optionalTransformMetricValues(JsonWriter jsonWriter, TreeNode node) {
    if (node instanceof ValueTreeNode) {
      ValueTreeNode valueNode = (ValueTreeNode) node;
      jsonWriter.prop("heightMetricValue", valueNode.getHeightMetricValue());
      jsonWriter.prop("footprintMetricValue", valueNode.getFootprintMetricValue());
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
    jsonWriter.prop("destinationId", edge.getDestinationId());
    jsonWriter.prop("depEdgeLabel", edge.getDepEdgeLabel());
    jsonWriter.prop("parentId", edge.getParentId());

    transformIncludingDependencies(jsonWriter, edge.getIncludingDependencies());

    jsonWriter.endObject();
  }

  private void transformIncludingDependencies(JsonWriter jsonWriter, List<BigInteger> includingDependencies) {
    jsonWriter.name("includingDependencies");
    jsonWriter.beginArray();

    for (final BigInteger dependencyId : includingDependencies) {
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
