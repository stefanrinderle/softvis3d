/*
 * SoftViz3d Sonar plugin
 * Copyright (C) 2013 Stefan Rinderle
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
package de.rinderle.softviz3d.layout.calc.topdown;

import att.grappa.Graph;
import att.grappa.GrappaBox;
import att.grappa.GrappaPoint;
import att.grappa.Node;
import com.google.inject.Inject;
import de.rinderle.softviz3d.layout.calc.LayoutViewType;
import de.rinderle.softviz3d.layout.helper.HexaColor;
import de.rinderle.softviz3d.layout.interfaces.SoftViz3dConstants;
import de.rinderle.softviz3d.tree.ResourceTreeService;
import de.rinderle.softviz3d.tree.TreeNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static att.grappa.GrappaConstants.HEIGHT_ATTR;
import static att.grappa.GrappaConstants.POS_ATTR;

public class AbsolutePositionCalculator implements PositionCalculator {

    private static final Logger LOGGER = LoggerFactory
            .getLogger(AbsolutePositionCalculator.class);

    private Map<Integer, Graph> inputGraphs;

    private Map<Integer, GrappaPoint> innerGraphTranslation;

    private int leafElements;

    @Inject
    private ResourceTreeService resourceTreeService;

    @Override
    public int calculate(Integer snapshotId, Map<Integer, Graph> inputGraphList, LayoutViewType layoutViewType) {
        leafElements = 0;

        this.innerGraphTranslation = new HashMap<Integer, GrappaPoint>();
        this.inputGraphs = inputGraphList;

        this.addTranslationToLayer(snapshotId, new GrappaPoint(0, 0), layoutViewType);

        return leafElements;
    }

    private void addTranslationToLayer(Integer sourceId, GrappaPoint posTranslation, LayoutViewType layoutViewType) {
        LOGGER.debug("AbsolutePositionCalculator addTranslationToLayer " + sourceId);

        // inputGraphs --> Map<Integer, Graph>
        // Step 1 - search the graph for the source given
        Graph graph = inputGraphs.get(sourceId);

        // Step 2 - set translation for the graph itself (will be a layer later)
        GrappaBox translatedBb = translateGraphBoundingBox(posTranslation, graph);

        // Step 3 - for all leaves, just add the parent point3d changes
        translateLeaves(posTranslation, graph, translatedBb);

        // Step 4 - for all dirs, call this method (recursive) with the parent + the self changes
        translateNodes(sourceId, graph, layoutViewType);
    }

    private void translateNodes(Integer sourceId, Graph graph, LayoutViewType layoutViewType) {
        List<TreeNode> children = resourceTreeService.getChildrenNodeIds(sourceId);

        for (TreeNode child : children) {
            GrappaPoint pos = innerGraphTranslation.get(child.getId());

            addTranslationToLayer(child.getId(), pos, layoutViewType);

            if (LayoutViewType.CITY.equals(layoutViewType)) {
                graph.removeNode("dir_" + child.getId());
            } else {
                Node dirNode = graph.findNodeByName("dir_" + child.getId());
                HexaColor color = new HexaColor(100, 100, 100);
                dirNode.setAttribute(SoftViz3dConstants.GRAPH_ATTR_NODES_COLOR, color.getHex());
                dirNode.setAttribute(SoftViz3dConstants.GRAPH_ATTR_TRANSPARENCY, "0.7");
                dirNode.setAttribute(SoftViz3dConstants.GRAPH_ATTR_BUILDING_HEIGHT, "5");
            }
        }
    }

    private void translateLeaves(GrappaPoint posTranslation, Graph graph, GrappaBox translatedBb) {
        GrappaPoint pos;
        double nodeLocationX;
        double nodeLocationY;
        for (Node leaf : graph.nodeElementsAsArray()) {
            pos = (GrappaPoint) leaf.getAttributeValue(POS_ATTR);

            int id = Integer.valueOf(leaf.getAttributeValue("id").toString());
            innerGraphTranslation.put(id, pos);

            // set the position of the node
            nodeLocationX = posTranslation.getX() + pos.getX() - translatedBb.getWidth() / 2;
            nodeLocationY = posTranslation.getY() + pos.getY() + translatedBb.getHeight() / 2;
            pos.setLocation(nodeLocationX, nodeLocationY);

            leaf.setAttribute(HEIGHT_ATTR, "not used");

            leafElements++;
        }
    }

    private GrappaBox translateGraphBoundingBox(GrappaPoint posTranslation, Graph graph) {
        GrappaBox bb = (GrappaBox) graph.getAttributeValue("bb");
        GrappaBox translatedBb = new GrappaBox(posTranslation.getX(), posTranslation.getY(), bb.getWidth(), bb.getHeight());
        graph.setAttribute("bb", translatedBb);
        return translatedBb;
    }

}
