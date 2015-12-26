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
package de.rinderle.softvis3d.base.domain.tree;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

public class RootTreeNodeTest {

  @Test
  public void testGetSourceDependenciesEmpty() throws Exception {
    final RootTreeNode underTest = new RootTreeNode(1);

    assertNotNull(underTest.getSourceDependencies());
    assertTrue(underTest.getSourceDependencies().isEmpty());
  }

  @Test
  public void testAddDependency() throws Exception {
    final RootTreeNode underTest = new RootTreeNode(1);

    final long dependencyId = 2L;
    final Dependency treeDependency = new Dependency(dependencyId, 1, "1", 2, "2");
    underTest.addDependency(treeDependency);

    assertNotNull(underTest.getSourceDependencies());
    assertFalse(underTest.getSourceDependencies().isEmpty());

    assertEquals(treeDependency, underTest.getSourceDependencies().get((int) dependencyId));
  }
}