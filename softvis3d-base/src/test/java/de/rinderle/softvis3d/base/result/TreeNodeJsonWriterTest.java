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
package de.rinderle.softvis3d.base.result;

import de.rinderle.softvis3d.base.TestTreeBuilder;
import de.rinderle.softvis3d.base.domain.tree.Dependency;
import de.rinderle.softvis3d.base.domain.tree.Edge;
import de.rinderle.softvis3d.base.domain.tree.RootTreeNode;
import de.rinderle.softvis3d.base.domain.tree.TreeNode;
import de.rinderle.softvis3d.base.layout.helper.StringOutputStream;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class TreeNodeJsonWriterTest {

  @Test
  public void testTransformTreeToJsonEmpty() throws Exception {
    final StringOutputStream stringOutputStream = new StringOutputStream();
    final SoftVis3dJsonWriter jsonWriter = new SoftVis3dJsonWriter(stringOutputStream);

    final TreeNodeJsonWriter underTest = new TreeNodeJsonWriter();

    final RootTreeNode tree = new RootTreeNode("1");
    underTest.transformRootTreeToJson(jsonWriter, tree);

    jsonWriter.close();

    final String expectedStringResult = "{\"treeResult\":{\"id\":\"1\",\"name\":\"root\",\"isNode\":false,\"children\":[],\"edges\":[],\"dependencies\":[]}}";

    assertEquals(expectedStringResult, stringOutputStream.toString());
  }

  @Test
  public void testTransformWithChildrenNodes() {
    final StringOutputStream stringOutputStream = new StringOutputStream();
    final SoftVis3dJsonWriter jsonWriter = new SoftVis3dJsonWriter(stringOutputStream);

    final TreeNodeJsonWriter underTest = new TreeNodeJsonWriter();

    final RootTreeNode treeNode1 = new RootTreeNode("1");
    TestTreeBuilder.createValueTreeNode("2", treeNode1, 1);
    TestTreeBuilder.createValueTreeNode("3", treeNode1, 2);

    underTest.transformRootTreeToJson(jsonWriter, treeNode1);

    jsonWriter.close();

    final String expectedResult = "{\"treeResult\":{\"id\":\"1\",\"name\":\"root\",\"isNode\":true,\"children\":[{\"id\":\"2\",\"name\":\"2\",\"isNode\":false,\"heightMetricValue\":2.0,\"footprintMetricValue\":2.0,\"colorMetricValue\":2.0,\"parentInfo\":{\"id\":\"1\",\"name\":\"root\",\"isNode\":true,\"heightMetricValue\":2.0,\"footprintMetricValue\":2.0,\"colorMetricValue\":2.0},\"children\":[],\"edges\":[]},{\"id\":\"3\",\"name\":\"3\",\"isNode\":false,\"heightMetricValue\":2.0,\"footprintMetricValue\":2.0,\"colorMetricValue\":2.0,\"parentInfo\":{\"id\":\"1\",\"name\":\"root\",\"isNode\":true,\"heightMetricValue\":2.0,\"footprintMetricValue\":2.0,\"colorMetricValue\":2.0},\"children\":[],\"edges\":[]}],\"edges\":[],\"dependencies\":[]}}";

    assertEquals(expectedResult, stringOutputStream.toString());
  }

  @Test
  public void testTransformWithDependencies() {
    final StringOutputStream stringOutputStream = new StringOutputStream();
    final SoftVis3dJsonWriter jsonWriter = new SoftVis3dJsonWriter(stringOutputStream);

    final TreeNodeJsonWriter underTest = new TreeNodeJsonWriter();

    final RootTreeNode treeNode1 = new RootTreeNode("1");
    final TreeNode node2 = TestTreeBuilder.createValueTreeNode("2", treeNode1, 1);
    TestTreeBuilder.createValueTreeNode("3", treeNode1, 2);

    final Edge edge = new Edge("edgeLabel", 2, "2", 3, "3");
    edge.addIncludingDependency(123L);
    node2.getEdges().put("123", edge);

    underTest.transformRootTreeToJson(jsonWriter, treeNode1);

    jsonWriter.close();

    final String expectedResult = "{\"treeResult\":{\"id\":\"1\",\"name\":\"root\",\"isNode\":true,\"children\":[{\"id\":\"2\",\"name\":\"2\",\"isNode\":false,\"heightMetricValue\":2.0,\"footprintMetricValue\":2.0,\"colorMetricValue\":2.0,\"parentInfo\":{\"id\":\"1\",\"name\":\"root\",\"isNode\":true,\"heightMetricValue\":2.0,\"footprintMetricValue\":2.0,\"colorMetricValue\":2.0},\"children\":[],\"edges\":[{\"id\":\"2 -> 3\",\"sourceId\":2,\"sourceName\":\"2\",\"destinationId\":3,\"destinationName\":\"3\",\"includingDependencies\":[{\"id\":123}]}]},{\"id\":\"3\",\"name\":\"3\",\"isNode\":false,\"heightMetricValue\":2.0,\"footprintMetricValue\":2.0,\"colorMetricValue\":2.0,\"parentInfo\":{\"id\":\"1\",\"name\":\"root\",\"isNode\":true,\"heightMetricValue\":2.0,\"footprintMetricValue\":2.0,\"colorMetricValue\":2.0},\"children\":[],\"edges\":[]}],\"edges\":[],\"dependencies\":[]}}";

    assertEquals(expectedResult, stringOutputStream.toString());
  }

  @Test
  public void testTransformWithRootDependencies() {
    final StringOutputStream stringOutputStream = new StringOutputStream();
    final SoftVis3dJsonWriter jsonWriter = new SoftVis3dJsonWriter(stringOutputStream);

    final TreeNodeJsonWriter underTest = new TreeNodeJsonWriter();

    final RootTreeNode treeNode1 = new RootTreeNode("1");
    final Dependency dependency = new Dependency(1L, 2, "2", 3, "3");
    treeNode1.addDependency(dependency);

    underTest.transformRootTreeToJson(jsonWriter, treeNode1);

    jsonWriter.close();

    final String expectedResult = "{\"treeResult\":{\"id\":\"1\",\"name\":\"root\",\"isNode\":false,\"children\":[],\"edges\":[],\"dependencies\":[{\"id\":1,\"sourceId\":2,\"sourceName\":\"2\",\"destinationId\":3,\"destinationName\":\"3\"}]}}";

    assertEquals(expectedResult, stringOutputStream.toString());
  }

}
