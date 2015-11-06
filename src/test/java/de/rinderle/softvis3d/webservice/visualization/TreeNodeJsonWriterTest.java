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

import de.rinderle.softvis3d.TestTreeBuilder;
import de.rinderle.softvis3d.domain.tree.Dependency;
import de.rinderle.softvis3d.domain.tree.Edge;
import de.rinderle.softvis3d.domain.tree.RootTreeNode;
import de.rinderle.softvis3d.domain.tree.TreeNode;
import java.io.StringWriter;
import org.junit.Test;
import org.sonar.api.utils.text.JsonWriter;

import static org.junit.Assert.assertEquals;

/**
 * Created by stefan on 12.07.15.
 */
public class TreeNodeJsonWriterTest {

  @Test
  public void testTransformTreeToJsonEmpty() throws Exception {
    final StringWriter stringWriter = new StringWriter();
    final JsonWriter jsonWriter = JsonWriter.of(stringWriter);

    final TreeNodeJsonWriter underTest = new TreeNodeJsonWriter();

    final RootTreeNode tree = new RootTreeNode(1);
    underTest.transformRootTreeToJson(jsonWriter, tree);

    final String expectedStringResult = "{\"treeResult\":{\"id\":1,\"name\":\"root\",\"isNode\":false,\"children\":[],\"edges\":[],\"dependencies\":[]}}";

    assertEquals(expectedStringResult, stringWriter.toString());
  }

  @Test
  public void testTransformWithChildrenNodes() {
    final StringWriter stringWriter = new StringWriter();
    final JsonWriter jsonWriter = JsonWriter.of(stringWriter);

    final TreeNodeJsonWriter underTest = new TreeNodeJsonWriter();

    final RootTreeNode treeNode1 = new RootTreeNode(1);
    TestTreeBuilder.createValueTreeNode(2, treeNode1, 1);
    TestTreeBuilder.createValueTreeNode(3, treeNode1, 2);

    underTest.transformRootTreeToJson(jsonWriter, treeNode1);

    final String expectedResult = "{\"treeResult\":{\"id\":1,\"name\":\"root\",\"isNode\":true,\"children\":[{\"id\":2,\"name\":\"2\",\"isNode\":false,\"heightMetricValue\":2.0,\"footprintMetricValue\":2.0,\"scmMetricValue\":2,\"parentInfo\":{\"id\":1,\"name\":\"root\",\"isNode\":true,\"heightMetricValue\":2.0,\"footprintMetricValue\":2.0,\"scmMetricValue\":2},\"children\":[],\"edges\":[]},{\"id\":3,\"name\":\"3\",\"isNode\":false,\"heightMetricValue\":2.0,\"footprintMetricValue\":2.0,\"scmMetricValue\":2,\"parentInfo\":{\"id\":1,\"name\":\"root\",\"isNode\":true,\"heightMetricValue\":2.0,\"footprintMetricValue\":2.0,\"scmMetricValue\":2},\"children\":[],\"edges\":[]}],\"edges\":[],\"dependencies\":[]}}";

    assertEquals(expectedResult, stringWriter.toString());
  }

  @Test
  public void testTransformWithDependencies() {
    final StringWriter stringWriter = new StringWriter();
    final JsonWriter jsonWriter = JsonWriter.of(stringWriter);

    final TreeNodeJsonWriter underTest = new TreeNodeJsonWriter();

    final RootTreeNode treeNode1 = new RootTreeNode(1);
    final TreeNode node2 = TestTreeBuilder.createValueTreeNode(2, treeNode1, 1);
    TestTreeBuilder.createValueTreeNode(3, treeNode1, 2);

    final Edge edge = new Edge("edgeLabel", 2, "2", 3, "3");
    edge.addIncludingDependency(123L);
    node2.getEdges().put("123", edge);

    underTest.transformRootTreeToJson(jsonWriter, treeNode1);

    final String expectedResult = "{\"treeResult\":{\"id\":1,\"name\":\"root\",\"isNode\":true,\"children\":[{\"id\":2,\"name\":\"2\",\"isNode\":false,\"heightMetricValue\":2.0,\"footprintMetricValue\":2.0,\"scmMetricValue\":2,\"parentInfo\":{\"id\":1,\"name\":\"root\",\"isNode\":true,\"heightMetricValue\":2.0,\"footprintMetricValue\":2.0,\"scmMetricValue\":2},\"children\":[],\"edges\":[{\"id\":\"2 -> 3\",\"sourceId\":2,\"sourceName\":\"2\",\"destinationId\":3,\"destinationName\":\"3\",\"includingDependencies\":[{\"id\":123}]}]},{\"id\":3,\"name\":\"3\",\"isNode\":false,\"heightMetricValue\":2.0,\"footprintMetricValue\":2.0,\"scmMetricValue\":2,\"parentInfo\":{\"id\":1,\"name\":\"root\",\"isNode\":true,\"heightMetricValue\":2.0,\"footprintMetricValue\":2.0,\"scmMetricValue\":2},\"children\":[],\"edges\":[]}],\"edges\":[],\"dependencies\":[]}}";

    assertEquals(expectedResult, stringWriter.toString());
  }

  @Test
  public void testTransformWithRootDependencies() {
    final StringWriter stringWriter = new StringWriter();
    final JsonWriter jsonWriter = JsonWriter.of(stringWriter);

    final TreeNodeJsonWriter underTest = new TreeNodeJsonWriter();

    final RootTreeNode treeNode1 = new RootTreeNode(1);
    final Dependency dependency = new Dependency(1L, 2, "2", 3, "3");
    treeNode1.addDependency(dependency);

    underTest.transformRootTreeToJson(jsonWriter, treeNode1);

    final String expectedResult = "{\"treeResult\":{\"id\":1,\"name\":\"root\",\"isNode\":false,\"children\":[],\"edges\":[],\"dependencies\":[{\"id\":1,\"sourceId\":2,\"sourceName\":\"2\",\"destinationId\":3,\"destinationName\":\"3\"}]}}";

    assertEquals(expectedResult, stringWriter.toString());
  }

}
