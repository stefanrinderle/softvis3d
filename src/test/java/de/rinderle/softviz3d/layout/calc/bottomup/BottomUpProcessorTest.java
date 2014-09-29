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

import de.rinderle.softviz3d.layout.dot.DotExcecutorException;
import de.rinderle.softviz3d.sonar.SonarService;
import de.rinderle.softviz3d.sonar.SonarSnapshot;
import de.rinderle.softviz3d.tree.TreeNode;
import de.rinderle.softviz3d.tree.TreeNodeType;
import de.rinderle.softviz3d.tree.ResourceTreeService;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.Matchers.*;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.powermock.api.mockito.PowerMockito.when;

public class BottomUpProcessorTest {

    private static final Integer METRIC_FOOTPRINT = 0;
    private static final Integer METRIC_HEIGHT = 0;

    @Mock
    private ResourceTreeService resourceTreeService;
    @Mock
    private SnapshotVisitor mockVisitor;
    @Mock
    private SonarService sonarService;

    private BottomUpProcessor underTest;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);

        underTest = new BottomUpProcessor(resourceTreeService, sonarService, METRIC_FOOTPRINT, METRIC_HEIGHT);
    }

    @Test
    public void testEmpty() throws DotExcecutorException {
        Integer snapshotId = 1;

        SonarSnapshot sonarSnapshot = createSonarSnapshot(snapshotId);
        int depth = 0;

        underTest.accept(mockVisitor, sonarSnapshot, depth);

        verify(sonarService, times(0)).getSnapshotsByIds(anyListOf(Integer.class), anyInt(), anyInt(), anyInt());
        verify(resourceTreeService, times(1)).getChildrenLeafIds(anyInt());
        verify(resourceTreeService, times(1)).getChildrenNodeIds(anyInt());
    }

    @Test
     public void testChildrenNodes() throws DotExcecutorException {
        Integer snapshotId = 1;
        int depth = 0;

        List<TreeNode> childrenTreeNodeIds = new ArrayList<TreeNode>();
        childrenTreeNodeIds.add(new TreeNode(2, null, depth, TreeNodeType.TREE));
        childrenTreeNodeIds.add(new TreeNode(2, null, depth, TreeNodeType.TREE));
        when(resourceTreeService.getChildrenNodeIds(snapshotId)).thenReturn(childrenTreeNodeIds);

        List<SonarSnapshot> snapshots = new ArrayList<SonarSnapshot>();
        snapshots.add(createSonarSnapshot(2));
        snapshots.add(createSonarSnapshot(3));
//        when(sonarService.getSnapshotsByIds(eq(childrenTreeNodeIds), eq(METRIC_FOOTPRINT), eq(METRIC_HEIGHT), eq(depth))).thenReturn(snapshots);

        SonarSnapshot sonarSnapshot = createSonarSnapshot(snapshotId);

        underTest.accept(mockVisitor, sonarSnapshot, depth);

//        verify(sonarService, times(1)).getSnapshotsByIds(eq(childrenTreeNodeIds), eq(METRIC_FOOTPRINT), eq(METRIC_HEIGHT), eq(depth));
        verify(resourceTreeService, times(3)).getChildrenLeafIds(anyInt());
        verify(resourceTreeService, times(3)).getChildrenNodeIds(anyInt());
    }

    /**
     * Check that if an id is not found in the database that a new
     * "generated" element is created. This can be verified by the fact
     * that resourceTreeService is called with the id that was missed
     * in the database.
     */
    @Test
    public void testChildrenNodesNoDaoResult() throws DotExcecutorException {
        Integer snapshotId = 1;
        int depth = 0;

        Integer missingId = 3;

        List<Integer> childrenNodeIds = new ArrayList<Integer>();
        childrenNodeIds.add(2);
        childrenNodeIds.add(missingId);
//        when(resourceTreeService.getChildrenNodeIds(snapshotId)).thenReturn(childrenNodeIds);

        List<SonarSnapshot> snapshots = new ArrayList<SonarSnapshot>();
        snapshots.add(createSonarSnapshot(2));
        // leave id 3 out of dao result
        when(sonarService.getSnapshotsByIds(eq(childrenNodeIds), eq(METRIC_FOOTPRINT), eq(METRIC_HEIGHT), eq(depth))).thenReturn(snapshots);

        SonarSnapshot sonarSnapshot = createSonarSnapshot(snapshotId);

        underTest.accept(mockVisitor, sonarSnapshot, depth);

        verify(sonarService, times(1)).getSnapshotsByIds(eq(childrenNodeIds), eq(METRIC_FOOTPRINT), eq(METRIC_HEIGHT), eq(depth));
        verify(resourceTreeService, times(3)).getChildrenLeafIds(anyInt());
        verify(resourceTreeService, times(3)).getChildrenNodeIds(anyInt());

        verify(resourceTreeService, times(1)).getChildrenNodeIds(eq(missingId));
    }

    @Test
    public void testChildrenLeaves() throws DotExcecutorException {
        Integer snapshotId = 1;
        int depth = 0;

        List<Integer> childrenLeafIds = new ArrayList<Integer>();
        childrenLeafIds.add(2);
        childrenLeafIds.add(3);
//        when(resourceTreeService.getChildrenLeafIds(snapshotId)).thenReturn(childrenLeafIds);

        List<SonarSnapshot> snapshots = new ArrayList<SonarSnapshot>();
        snapshots.add(createSonarSnapshot(2));
        snapshots.add(createSonarSnapshot(3));
        when(sonarService.getSnapshotsByIds(eq(childrenLeafIds), eq(METRIC_FOOTPRINT), eq(METRIC_HEIGHT), eq(depth + 1))).thenReturn(snapshots);

        SonarSnapshot sonarSnapshot = createSonarSnapshot(snapshotId);

        underTest.accept(mockVisitor, sonarSnapshot, depth);

        verify(sonarService, times(1)).getSnapshotsByIds(eq(childrenLeafIds), eq(METRIC_FOOTPRINT), eq(METRIC_HEIGHT), eq(depth + 1));
        verify(resourceTreeService, times(1)).getChildrenNodeIds(anyInt());
        verify(resourceTreeService, times(1)).getChildrenLeafIds(anyInt());
    }

    private SonarSnapshot createSonarSnapshot(Integer snapshotId) {
        Integer id = snapshotId;
        String name = "snapshotName";
        Integer depth = 0;
        Double footprintMetricValue = 0.0;
        Double heightMetricValue = 0.0;
        return new SonarSnapshot(id, name, depth, footprintMetricValue, heightMetricValue);
    }

}
