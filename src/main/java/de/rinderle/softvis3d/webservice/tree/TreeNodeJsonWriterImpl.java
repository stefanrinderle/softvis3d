/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.webservice.tree;

import de.rinderle.softvis3d.domain.tree.Edge;
import de.rinderle.softvis3d.domain.tree.TreeNode;
import de.rinderle.softvis3d.domain.tree.ValueTreeNode;
import org.sonar.api.server.ws.Response;
import org.sonar.api.utils.text.JsonWriter;

import java.util.Map;

public class TreeNodeJsonWriterImpl implements TreeNodeJsonWriter {

  @Override
  public void transformTreeToJson(final Response response, final TreeNode tree) {
    final JsonWriter jsonWriter = response.newJsonWriter();

    this.transformTreeToJson(jsonWriter, tree);

    jsonWriter.close();
  }

  private void transformTreeToJson(final JsonWriter jsonWriter, final TreeNode node) {
    jsonWriter.beginObject();

    jsonWriter.prop("id", node.getId());
    jsonWriter.prop("name", node.getName());
    jsonWriter.prop("isNode", node.isNode());
    optionalTransformMetricvalues(jsonWriter, node);

    final TreeNode parent = node.getParent();
    if (parent != null) {
      jsonWriter.name("parentInfo");

      jsonWriter.beginObject();
      jsonWriter.prop("id", parent.getId());
      jsonWriter.prop("name", parent.getName());
      jsonWriter.prop("isNode", parent.isNode());
      optionalTransformMetricvalues(jsonWriter, node);
      jsonWriter.endObject();
    }

    this.transformChildren(jsonWriter, node.getChildren());

    this.transformEdges(jsonWriter, node.getEdges());

    jsonWriter.endObject();
  }

  private void optionalTransformMetricvalues(JsonWriter jsonWriter, TreeNode node) {
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
    jsonWriter.prop("counter", edge.getCounter());
    jsonWriter.endObject();
  }

  private void transformChildren(final JsonWriter jsonWriter, final Map<String, TreeNode> children) {
    jsonWriter.name("children");
    jsonWriter.beginArray();

    for (final TreeNode child : children.values()) {
      this.transformTreeToJson(jsonWriter, child);
    }

    jsonWriter.endArray();
  }
}
