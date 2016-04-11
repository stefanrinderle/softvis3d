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
package de.rinderle.softvis3d.base.layout.bottomup;

import de.rinderle.softvis3d.base.VisualizationAdditionalInfos;
import de.rinderle.softvis3d.base.VisualizationSettings;
import de.rinderle.softvis3d.base.domain.LayoutViewType;
import de.rinderle.softvis3d.base.domain.MinMaxValue;
import de.rinderle.softvis3d.base.domain.layout.LayeredLayoutElement;
import de.rinderle.softvis3d.base.domain.tree.DependencyTreeNode;
import de.rinderle.softvis3d.base.domain.tree.TreeNodeType;
import de.rinderle.softvis3d.base.domain.tree.ValueTreeNode;
import de.rinderle.softvis3d.base.layout.bottomup.grappa.GrappaEdgeFactory;
import de.rinderle.softvis3d.base.layout.bottomup.grappa.GrappaNodeFactory;
import de.rinderle.softvis3d.base.layout.dot.DotExecutor;
import de.rinderle.softvis3d.base.layout.format.LayerFormatter;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class SnapshotVisitorBeanTest {

  private final DotExecutor dotExecutor = new DotExecutor();
  private final LayerFormatter formatter = new LayerFormatter();
  private final GrappaNodeFactory nodeFactory = new GrappaNodeFactory();
  private final GrappaEdgeFactory edgeFactory = new GrappaEdgeFactory();

  @Test
  public void testVisitFile() throws Exception {
    final VisualizationSettings settings = new VisualizationSettings();

    final VisualizationAdditionalInfos additionalInfos = createAdditionalInfos();

    final SnapshotVisitorBean visitorBean =
      new SnapshotVisitorBean(formatter, dotExecutor, nodeFactory, edgeFactory, settings, LayoutViewType.CITY, additionalInfos);

    final String displayName = "leaf1";
    final String id = "1";
    final ValueTreeNode leaf = new ValueTreeNode(id, null, 0, TreeNodeType.TREE, displayName, 0.0, 10.0, 4);
    final LayeredLayoutElement result = visitorBean.visitFile(leaf);

    assertEquals(displayName, result.getDisplayName());
    assertEquals(id, result.getId());
    assertEquals(TreeNodeType.TREE, result.getElementType());
  }

  @Test
  public void testVisitFileDependency() throws Exception {
    final String id = "1";

    final VisualizationSettings settings = new VisualizationSettings();
    final VisualizationAdditionalInfos additionalInfos = createAdditionalInfos();
    final SnapshotVisitorBean visitorBean =
      new SnapshotVisitorBean(formatter, dotExecutor, nodeFactory, edgeFactory, settings, LayoutViewType.DEPENDENCY, additionalInfos);

    final DependencyTreeNode leaf = new DependencyTreeNode(id, null, 0);
    final LayeredLayoutElement result = visitorBean.visitFile(leaf);

    assertEquals(id, result.getId());
    assertEquals(TreeNodeType.DEPENDENCY_GENERATED, result.getElementType());
  }

  private VisualizationAdditionalInfos createAdditionalInfos() {
    final MinMaxValue minMaxFootprint = new MinMaxValue(0, 3);
    final MinMaxValue minMaxHeight = new MinMaxValue(0, 3);
    final MinMaxValue minMaxColor = new MinMaxValue(0, 3);
    final int dependencyCount = 0;

    return new VisualizationAdditionalInfos(minMaxFootprint, minMaxHeight, minMaxColor, dependencyCount);
  }
}
