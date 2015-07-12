package de.rinderle.softvis3d.layout.bottomup.grappa;

import att.grappa.Graph;
import att.grappa.GrappaConstants;
import att.grappa.Node;
import de.rinderle.softvis3d.domain.SoftVis3DConstants;
import de.rinderle.softvis3d.domain.layout.LayeredLayoutElement;
import de.rinderle.softvis3d.domain.tree.TreeNode;
import de.rinderle.softvis3d.domain.tree.TreeNodeType;
import de.rinderle.softvis3d.layout.helper.HexaColor;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

/**
 * Created by stefan on 10.07.15.
 */
public class GrappaNodeFactoryTest {

  @Test
  public void testTransformToGrappaNode() throws Exception {
    final Graph inputGraph = new Graph("graphName");

    final TreeNodeType type = TreeNodeType.TREE;
    final Integer id = 3;
    final String name = "elementName";
    final Double width = 42.4;
    final Double height = 23.4;
    final Double buildingHeight = 1.3;
    final HexaColor color = new HexaColor(0, 0, 0);

    final TreeNode node = new TreeNode(id, null, 0, type, name);
    final LayeredLayoutElement element =
      LayeredLayoutElement.createLayeredLayoutElement(node, width, height, buildingHeight, color);

    final Node result = new GrappaNodeFactory().transformToGrappaNode(inputGraph, element);

    assertEquals(id.toString(), result.getAttribute("id").getStringValue());
    assertEquals(type.name(), result.getAttribute("type").getStringValue());
    assertEquals(width, result.getAttribute(GrappaConstants.WIDTH_ATTR).getValue());
    assertEquals(height, result.getAttribute(GrappaConstants.HEIGHT_ATTR).getValue());

    assertEquals(".", result.getAttribute(GrappaConstants.LABEL_ATTR).getStringValue());
    assertEquals("box", result.getAttribute(GrappaConstants.SHAPE_ATTR).getStringValue());

    assertEquals("x" + buildingHeight,
      result.getAttribute(SoftVis3DConstants.GRAPH_ATTR_BUILDING_HEIGHT).getStringValue());
    assertEquals(color.getHex(), result.getAttribute(SoftVis3DConstants.SOFTVIZ_COLOR).getStringValue());
    assertEquals(element.getDisplayName(), result.getAttribute("displayName").getStringValue());
  }

}
