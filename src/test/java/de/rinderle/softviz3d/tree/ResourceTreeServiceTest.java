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

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
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
        int snaphotId = 1;

        List<Object[]> children = new ArrayList<Object[]>();
        children.add(new Object[]{2, "src"});
        children.add(new Object[]{3, "src/eins"});
        children.add(new Object[]{4, "src/zwei"});
        children.add(new Object[]{5, "src/zwei/drei"});
        when(sonarDao.getAllChildrenFlat(snaphotId)).thenReturn(children);

        underTest.createTreeStructrue(snaphotId);

        // Check leaf
        List<Integer> leafs = underTest.getChildrenLeafIds(2);
        assertTrue(leafs.contains(3));
        assertEquals(leafs.size(), 1);

        // Check node
        List<Integer> nodes = underTest.getChildrenNodeIds(2);
        assertTrue(nodes.contains(4));
        assertEquals(nodes.size(), 1);
    }
}
