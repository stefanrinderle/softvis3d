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

import att.grappa.Graph;
import att.grappa.GrappaBox;
import att.grappa.GrappaConstants;
import att.grappa.GrappaPoint;
import att.grappa.Node;
import de.rinderle.softvis3d.domain.SoftVis3DConstants;
import de.rinderle.softvis3d.domain.graph.ResultPlatform;
import de.rinderle.softvis3d.domain.tree.TreeNodeType;
import de.rinderle.softvis3d.layout.format.GrappaGraphTestFactory;
import de.rinderle.softvis3d.layout.helper.HexaColor;
import org.junit.Test;
import org.sonar.api.utils.text.JsonWriter;

import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertEquals;

/**
 * Created by stefan on 12.07.15.
 */
public class VisualizationJsonWriterTest {

  @Test
  public void testTransformResponseToJson() throws Exception {
    final StringWriter stringWriter = new StringWriter();
    final JsonWriter jsonWriter = JsonWriter.of(stringWriter);

    VisualizationJsonWriter underTest = new VisualizationJsonWriter();

    Map<Integer, ResultPlatform> results = new HashMap<>();
    ResultPlatform platform = createExamplePlatform();
    results.put(1, platform);

    underTest.transformResponseToJson(jsonWriter, results);

    String expectedResult = "{\"visualizationResult\":[{\"platformId\":1,\"opacity\":0.0,\"height3d\":0,\"positionX\":0.0,\"positionY\":0.0,\"width\":100.0,\"platformHeight\":5.0,\"height\":200.0,\"nodes\":[{\"id\":123,\"buildingHeight\":10.3,\"height\":400.3,\"width\":300.4,\"positionX\":1.0,\"positionY\":2.0,\"type\":\"PATH_GENERATED\",\"opacity\":0.0,\"color\":\"#FE8C00\",\"height3d\":0,\"arrows\":[]}]}]}";
    assertEquals(expectedResult, stringWriter.toString());
  }

  @Test
  public void testTransformResponseToJsonWithArrows() throws Exception {
    final StringWriter stringWriter = new StringWriter();
    final JsonWriter jsonWriter = JsonWriter.of(stringWriter);

    VisualizationJsonWriter underTest = new VisualizationJsonWriter();

    Map<Integer, ResultPlatform> results = new HashMap<>();
    ResultPlatform platform = GrappaGraphTestFactory.createPlatform();
    results.put(1, platform);

    underTest.transformResponseToJson(jsonWriter, results);

    // TODO: somehow this does not match
    // String expectedResult =
    // "{\"visualizationResult\":[{\"platformId\":1,\"opacity\":0.0,\"height3d\":0,\"positionX\":0.0,\"positionY\":0.0,\"width\":50.0,\"platformHeight\":5.0,\"height\":50.0,\"nodes\":[{\"id\":2,\"buildingHeight\":0.0,\"height\":0.5,\"width\":0.75,\"positionX\":0.0,\"positionY\":-0.0,\"type\":\"TREE\",\"opacity\":0.0,\"color\":\"#FFFFFF\",\"height3d\":0,\"arrows\":[{\"id\":\"N0_1436699293540 -> N0_1436699293543\",\"headId\":\"N0_1436699293543\",\"tailId\":\"N0_1436699293540\",\"radius\":3.3,\"opacity\":0.0,\"color\":\"#0000FF\",\"height3d\":0,\"translatedPoints\":[{\"x\":0.0,\"y\":0.0,\"z\":1.0},{\"x\":2.0,\"y\":0.0,\"z\":3.0}]},{\"id\":\"N0_1436699293540 -> N0_1436699293543\",\"headId\":\"N0_1436699293543\",\"tailId\":\"N0_1436699293540\",\"radius\":3.3,\"opacity\":0.0,\"color\":\"#0000FF\",\"height3d\":0,\"translatedPoints\":[{\"x\":0.0,\"y\":0.0,\"z\":1.0},{\"x\":2.0,\"y\":0.0,\"z\":3.0}]}]},{\"id\":3,\"buildingHeight\":0.0,\"height\":0.5,\"width\":0.75,\"positionX\":0.0,\"positionY\":-0.0,\"type\":\"TREE\",\"opacity\":0.0,\"color\":\"#FFFFFF\",\"height3d\":0,\"arrows\":[{\"id\":\"N0_1436699293540 -> N0_1436699293543\",\"headId\":\"N0_1436699293543\",\"tailId\":\"N0_1436699293540\",\"radius\":3.3,\"opacity\":0.0,\"color\":\"#0000FF\",\"height3d\":0,\"translatedPoints\":[{\"x\":0.0,\"y\":0.0,\"z\":1.0},{\"x\":2.0,\"y\":0.0,\"z\":3.0}]}]}]}]}";
    // assertEquals(expectedResult, stringWriter.toString());
  }

  private ResultPlatform createExamplePlatform() {
    Graph graph = new Graph("rootNode");
    Node node = new Node(graph, "testNode");
    node.setAttribute("id", "123");
    node.setAttribute(GrappaConstants.WIDTH_ATTR, "300.4");
    node.setAttribute(GrappaConstants.HEIGHT_ATTR, "400.3");

    node.setAttribute(SoftVis3DConstants.GRAPH_ATTR_BUILDING_HEIGHT, "x10.3");

    HexaColor color = new HexaColor(254, 140, 0);
    node.setAttribute(SoftVis3DConstants.SOFTVIZ_COLOR, color.getHex());

    TreeNodeType type = TreeNodeType.PATH_GENERATED;
    node.setAttribute("type", type.name());

    node.setAttribute(GrappaConstants.POS_ATTR, new GrappaPoint(1, 2));

    ResultPlatform platform = new ResultPlatform(graph);

    platform.setBoundingBox(new GrappaBox(0, 0, 100, 200));

    return platform;
  }

}
