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
package de.rinderle.softvis3d.layout.bottomup;

import de.rinderle.softvis3d.VisualizationSettings;
import de.rinderle.softvis3d.domain.LayoutViewType;
import de.rinderle.softvis3d.domain.tree.DependencyTreeNode;
import de.rinderle.softvis3d.domain.tree.TreeNodeType;
import de.rinderle.softvis3d.domain.tree.ValueTreeNode;
import de.rinderle.softvis3d.layout.bottomup.grappa.GrappaEdgeFactory;
import de.rinderle.softvis3d.layout.bottomup.grappa.GrappaNodeFactory;
import de.rinderle.softvis3d.layout.dot.DotExecutor;
import de.rinderle.softvis3d.layout.format.LayerFormatter;
import org.junit.Ignore;
import org.junit.Test;

/**
 * Created by stefan on 12.07.15.
 */
public class SnapshotVisitorBeanTest {

  private DotExecutor dotExecutor = new DotExecutor();
  private LayerFormatter formatter = new LayerFormatter();
  private GrappaNodeFactory nodeFactory = new GrappaNodeFactory();
  private GrappaEdgeFactory edgeFactory = new GrappaEdgeFactory();

  @Test
  @Ignore
  public void testVisitFile() throws Exception {
    final VisualizationSettings settings = new VisualizationSettings();
//    settings.setProperty(SoftVis3DConstants.DOT_BIN_KEY, "/usr/bin/dot");
    final SnapshotVisitorBean visitorBean =
      new SnapshotVisitorBean(formatter, dotExecutor, nodeFactory, edgeFactory, settings, LayoutViewType.CITY, null);

    final ValueTreeNode leaf = new ValueTreeNode(1, null, 0, TreeNodeType.TREE, "leaf1", 0.0, 10.0, 4);
    visitorBean.visitFile(leaf);
  }

  @Test
  @Ignore
  public void testVisitFileDependency() throws Exception {
    final int id = 1;

    final VisualizationSettings settings = new VisualizationSettings();
//    settings.setProperty(SoftVis3DConstants.DOT_BIN_KEY, "/usr/bin/dot");
    final SnapshotVisitorBean visitorBean =
      new SnapshotVisitorBean(formatter, dotExecutor, nodeFactory, edgeFactory, settings, LayoutViewType.CITY, null);

    final DependencyTreeNode leaf = new DependencyTreeNode(1, null, 0);
    visitorBean.visitFile(leaf);
  }
}
