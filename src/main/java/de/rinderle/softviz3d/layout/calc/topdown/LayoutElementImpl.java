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

import com.google.inject.Inject;
import de.rinderle.softviz3d.layout.calc.LayeredLayoutElement;
import de.rinderle.softviz3d.layout.dot.DotExcecutorException;
import de.rinderle.softviz3d.sonar.SonarService;
import de.rinderle.softviz3d.sonar.SonarSnapshot;
import de.rinderle.softviz3d.tree.ResourceTreeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

public class LayoutElementImpl implements LayoutElement {

    private static final Logger LOGGER = LoggerFactory
            .getLogger(LayoutElementImpl.class);

    @Inject
    private ResourceTreeService resourceTreeService;
    @Inject
    private SonarService sonarService;

    /**
     * Bottom up calculation of layout layers.
     */
    public LayeredLayoutElement accept(LayoutVisitor visitor, SonarSnapshot source, int depth, Integer footprintMetricId, Integer heightMetricId)
            throws DotExcecutorException {

        LOGGER.debug("Layout.accept " + source.getId() + " " + source.getName());

        List<LayeredLayoutElement> layerElements = new ArrayList<LayeredLayoutElement>();

        List<Integer> childrenNodeIds = resourceTreeService.getChildrenNodeIds(source.getId());

        List<SonarSnapshot> childrenNodes;
        if (childrenNodeIds.isEmpty()) {
            childrenNodes = new ArrayList<SonarSnapshot>();
        } else {
            childrenNodes = sonarService.getSnapshotsByIds(childrenNodeIds, depth, footprintMetricId, heightMetricId);

            if (childrenNodeIds.size() != childrenNodes.size()) {
                for (Integer nodeId : childrenNodeIds) {
                    if (!isIdInDatabaseResult(nodeId, childrenNodes)) {
                        SonarSnapshot generatedSnapshot =
                                new SonarSnapshot(nodeId, "generated" + nodeId, depth, 0.0, 0.0);
                        childrenNodes.add(generatedSnapshot);
                    }
                }
            }
        }

        for (SonarSnapshot node : childrenNodes) {
            layerElements.add(this.accept(visitor, node, depth + 1, footprintMetricId, heightMetricId));
        }

        List<Integer> childrenLeafIds = resourceTreeService.getChildrenLeafIds(source.getId());

        List<SonarSnapshot> childrenLeaf;
        if (childrenLeafIds.isEmpty()) {
            childrenLeaf = new ArrayList<SonarSnapshot>();
        } else {
            childrenLeaf = sonarService.getSnapshotsByIds(childrenLeafIds, depth + 1, footprintMetricId, heightMetricId);
        }

        List<SonarSnapshot> childrenLeaves = childrenLeaf;

        for (SonarSnapshot leaf : childrenLeaves) {
            layerElements.add(visitor.visitFile(leaf));
        }

        LayeredLayoutElement layer = visitor.visitNode(source, layerElements);

        return layer;
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
