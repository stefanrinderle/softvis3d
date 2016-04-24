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

import att.grappa.Graph;
import att.grappa.GrappaBox;
import att.grappa.GrappaConstants;
import att.grappa.GrappaPoint;
import att.grappa.Node;
import de.rinderle.softvis3d.base.domain.LayoutConstants;
import de.rinderle.softvis3d.base.domain.graph.ResultPlatform;
import de.rinderle.softvis3d.base.domain.tree.TreeNodeType;
import de.rinderle.softvis3d.base.layout.helper.HexaColor;
import de.rinderle.softvis3d.base.layout.helper.StringOutputStream;
import java.util.HashMap;
import java.util.Map;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class VisualizationJsonWriterTest {

  @Test
  public void testTransformResponseToJson() throws Exception {
    final StringOutputStream stringOutputStream = new StringOutputStream();
    final SoftVis3dJsonWriter jsonWriter = new SoftVis3dJsonWriter(stringOutputStream);

    final VisualizationJsonWriter underTest = new VisualizationJsonWriter();

    final Map<String, ResultPlatform> results = new HashMap<>();
    final ResultPlatform platform = createExamplePlatform();
    results.put("1", platform);

    underTest.transformResponseToJson(jsonWriter, results);

    jsonWriter.close();

    final String expectedResult = "{\"visualizationResult\":[{\"platformId\":\"1\",\"opacity\":0.0,\"height3d\":0,\"positionX\":0.0,\"positionY\":0.0,\"width\":100.0,\"platformHeight\":5.0,\"height\":200.0,\"nodes\":[{\"id\":\"123\",\"buildingHeight\":10.3,\"height\":400.3,\"width\":300.4,\"positionX\":1.0,\"positionY\":2.0,\"type\":\"PATH_GENERATED\",\"opacity\":0.0,\"color\":\"#FE8C00\",\"height3d\":0}]}]}";
    assertEquals(expectedResult, stringOutputStream.toString());
  }

  private ResultPlatform createExamplePlatform() {
    final Graph graph = new Graph("rootNode");
    final Node node = new Node(graph, "testNode");
    node.setAttribute("id", "123");
    node.setAttribute(GrappaConstants.WIDTH_ATTR, "300.4");
    node.setAttribute(GrappaConstants.HEIGHT_ATTR, "400.3");

    node.setAttribute(LayoutConstants.GRAPH_ATTR_BUILDING_HEIGHT, "x10.3");

    final HexaColor color = new HexaColor(254, 140, 0);
    node.setAttribute(LayoutConstants.SOFTVIZ_COLOR, color.getHex());

    final TreeNodeType type = TreeNodeType.PATH_GENERATED;
    node.setAttribute("type", type.name());

    node.setAttribute(GrappaConstants.POS_ATTR, new GrappaPoint(1, 2));

    final ResultPlatform platform = new ResultPlatform(graph);

    platform.setBoundingBox(new GrappaBox(0, 0, 100, 200));

    return platform;
  }

}
