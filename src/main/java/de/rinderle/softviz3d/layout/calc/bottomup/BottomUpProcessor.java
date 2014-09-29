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
package de.rinderle.softviz3d.layout.calc.bottomup;

import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;
import de.rinderle.softviz3d.layout.calc.LayeredLayoutElement;
import de.rinderle.softviz3d.layout.dot.DotExcecutorException;
import de.rinderle.softviz3d.sonar.SonarService;
import de.rinderle.softviz3d.sonar.SonarSnapshot;
import de.rinderle.softviz3d.tree.TreeNode;
import de.rinderle.softviz3d.tree.ResourceTreeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

public class BottomUpProcessor implements Processor {

    private static final Logger LOGGER = LoggerFactory
            .getLogger(BottomUpProcessor.class);

    private ResourceTreeService resourceTreeService;
    private SonarService sonarService;
    private Integer footprintMetricId;
    private Integer heightMetricId;

    @Inject
    public BottomUpProcessor(ResourceTreeService resourceTreeService,
                             SonarService sonarService,
                             @Assisted("footprintMetricId") Integer footprintMetricId,
                             @Assisted("heightMetricId") Integer heightMetricId) {
        this.resourceTreeService = resourceTreeService;
        this.sonarService = sonarService;

        this.footprintMetricId = footprintMetricId;
        this.heightMetricId = heightMetricId;
    }

    /**
     * Bottom up calculation of layout layers.
     */
    public LayeredLayoutElement accept(SnapshotVisitor visitor, SonarSnapshot source, int depth)
            throws DotExcecutorException {

        LOGGER.debug("Layout.accept " + source.getId() + " " + source.getName());

        List<LayeredLayoutElement> nodeElements = processChildrenNodes(visitor, source, depth);
        List<LayeredLayoutElement> leafElements = processChildrenLeaves(visitor, source, depth);

        List<LayeredLayoutElement> layerElements = new ArrayList<LayeredLayoutElement>();
        layerElements.addAll(nodeElements);
        layerElements.addAll(leafElements);

        return visitor.visitNode(source, layerElements);
    }

    private List<LayeredLayoutElement> processChildrenNodes(SnapshotVisitor visitor, SonarSnapshot source, int depth) throws DotExcecutorException {
        List<TreeNode> childrenTreeNodeIds = resourceTreeService.getChildrenNodeIds(source.getId());

        List<SonarSnapshot> childrenNodes = getSonarSnapshots(childrenTreeNodeIds, depth);

        boolean hasSameSize = childrenTreeNodeIds.size() == childrenNodes.size();
        if (!hasSameSize) {
            for (TreeNode treeNode : childrenTreeNodeIds) {
                if (!isIdInDatabaseResult(treeNode.getId(), childrenNodes)) {
                    SonarSnapshot generatedSnapshot =
                            new SonarSnapshot(treeNode.getId(), "generated" + treeNode.getId(), depth, 0.0, 0.0);
                    childrenNodes.add(generatedSnapshot);
                }
            }
        }

        List<LayeredLayoutElement> layerElements = new ArrayList<LayeredLayoutElement>();

        for (SonarSnapshot node : childrenNodes) {
            layerElements.add(this.accept(visitor, node, depth + 1));
        }
        return layerElements;
    }

    private List<LayeredLayoutElement> processChildrenLeaves(SnapshotVisitor visitor, SonarSnapshot source,
        int depth) {
        List<TreeNode> childrenLeafsIds = resourceTreeService.getChildrenLeafIds(source.getId());

        List<SonarSnapshot> childrenLeaves = getSonarSnapshots(childrenLeafsIds, depth + 1);

        boolean hasSameSize = childrenLeafsIds.size() == childrenLeaves.size();
        if (!hasSameSize) {
            for (TreeNode treeNode : childrenLeafsIds) {
                if (!isIdInDatabaseResult(treeNode.getId(), childrenLeaves)) {
                    SonarSnapshot generatedSnapshot =
                        new SonarSnapshot(treeNode.getId(), "generated" + treeNode.getId(), depth, 0.0, 0.0);
                    childrenLeaves.add(generatedSnapshot);
                }
            }
        }

        List<LayeredLayoutElement> layerElements = new ArrayList<LayeredLayoutElement>();
        for (SonarSnapshot leaf : childrenLeaves) {
            layerElements.add(visitor.visitFile(leaf));
        }

        return layerElements;
    }

    private List<SonarSnapshot> getSonarSnapshots(List<TreeNode> treeNodes, int depth) {
        List<SonarSnapshot> snapshots;
        if (treeNodes.isEmpty()) {
            snapshots = new ArrayList<SonarSnapshot>();
        } else {

            ArrayList<Integer> snapshotIds = new ArrayList<Integer>();
            for(TreeNode treeNode : treeNodes) {
                snapshotIds.add(treeNode.getId());
            }

            snapshots = sonarService.getSnapshotsByIds(snapshotIds, footprintMetricId, heightMetricId, depth);
        }
        return snapshots;
    }

    private boolean isIdInDatabaseResult(int id, List<SonarSnapshot> childrenNodes) {
        for (SonarSnapshot snapshot : childrenNodes) {
            if (id == snapshot.getId()) {
                return true;
            }
        }

        return false;
    }

}
