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
package de.rinderle.softviz3d.tree;

import de.rinderle.softviz3d.depth.ResourceTreeServiceImpl;
import de.rinderle.softviz3d.sonar.SonarDao;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.*;
import static org.mockito.Mockito.when;

public class ResourceTreeServiceTest {

    @Mock
    private SonarDao sonarDao;

    @InjectMocks
    private ResourceTreeServiceImpl underTest;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void test() {
        int snapshotId = 1;

        List<Object[]> children = new ArrayList<Object[]>();
        children.add(new Object[]{2, "src"});
        children.add(new Object[]{3, "src/eins"});
        children.add(new Object[]{4, "src/zwei"});
        children.add(new Object[]{5, "src/zwei/drei"});
        when(sonarDao.getAllChildrenFlat(snapshotId)).thenReturn(children);

        underTest.createTreeStructrue(snapshotId);

        // Check leaf
        List<Integer> leafs = underTest.getChildrenLeafIds(2);
        assertTrue(leafs.contains(3));
        assertEquals(1, leafs.size());

        // Check node
        List<Integer> nodes = underTest.getChildrenNodeIds(2);
        assertTrue(nodes.contains(4));
        assertEquals(1, nodes.size());
    }

    @Test
    public void testLongSameIdInTree() {
        int snapshotId = 1;

        List<Object[]> children = new ArrayList<Object[]>();
        children.add(new Object[]{2, "src/eins/zwei/drei"});
        children.add(new Object[]{3, "src/eins/zwei/drei/child1"});
        children.add(new Object[]{4, "src/eins/zwei/drei/child2"});
        when(sonarDao.getAllChildrenFlat(snapshotId)).thenReturn(children);

        underTest.createTreeStructrue(snapshotId);

        // Check leaf
        List<Integer> leafs = underTest.getChildrenLeafIds(2);
        assertTrue(leafs.contains(3));
        assertEquals(2, leafs.size());

        // Check node
        List<Integer> nodes = underTest.getChildrenNodeIds(1);
        assertEquals(1, nodes.size());
    }

    @Test
    public void test2() {
        int snapshotId = 573;

        List<Object[]> children = new ArrayList<Object[]>();
        children.add(new Object[]{574, "app/base"});
        children.add(new Object[]{575, "app/base/Global.java"});
        children.add(new Object[]{576, "app/base/Global_deplete_do_not_commit.java"});
        children.add(new Object[]{577, "app/controllers"});
        children.add(new Object[]{578, "app/controllers/ApplicationController.java"});
        children.add(new Object[]{579, "app/controllers/ChartsController.java"});
        children.add(new Object[]{580, "app/controllers/CityController.java"});
        children.add(new Object[]{581, "app/controllers/ForecastController.java"});
        children.add(new Object[]{582, "app/controllers/MobileController.java"});
        children.add(new Object[]{583, "app/controllers/StaticPageController.java"});
        children.add(new Object[]{584, "app/controllers/WebserviceTestController.java"});
        children.add(new Object[]{585, "app/dto"});
        children.add(new Object[]{586, "app/dto/ClothesDTO.java"});
        children.add(new Object[]{587, "app/dto/ClothesForecastDTO.java"});

        when(sonarDao.getAllChildrenFlat(snapshotId)).thenReturn(children);

        underTest.createTreeStructrue(snapshotId);

        // Check leaf
        List<Integer> leafs = underTest.getChildrenLeafIds(574);
        assertTrue(leafs.contains(2));
        assertEquals(2, leafs.size());

        // Check node
        List<Integer> nodes = underTest.getChildrenNodeIds(573);
        assertFalse(nodes.contains(574));

        List<Integer> childsFromGenerated = underTest.getChildrenNodeIds(nodes.get(0));
        assertFalse(childsFromGenerated.contains(574));
        assertFalse(childsFromGenerated.contains(577));
        assertFalse(childsFromGenerated.contains(585));

    }
}
