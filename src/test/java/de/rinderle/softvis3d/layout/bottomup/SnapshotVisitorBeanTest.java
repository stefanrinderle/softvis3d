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

import static org.mockito.Matchers.anyInt;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.Test;
import org.sonar.api.config.Settings;
import de.rinderle.softvis3d.dao.DaoService;
import de.rinderle.softvis3d.domain.LayoutViewType;
import de.rinderle.softvis3d.domain.MinMaxValue;
import de.rinderle.softvis3d.domain.ScmInfoType;
import de.rinderle.softvis3d.domain.SoftVis3DConstants;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.tree.DependencyTreeNode;
import de.rinderle.softvis3d.domain.tree.TreeNodeType;
import de.rinderle.softvis3d.domain.tree.ValueTreeNode;
import de.rinderle.softvis3d.layout.bottomup.grappa.GrappaEdgeFactory;
import de.rinderle.softvis3d.layout.bottomup.grappa.GrappaNodeFactory;
import de.rinderle.softvis3d.layout.dot.DotExecutor;
import de.rinderle.softvis3d.layout.format.LayerFormatter;

/**
 * Created by stefan on 12.07.15.
 */
public class SnapshotVisitorBeanTest {

  private DotExecutor dotExecutor = new DotExecutor();
  private LayerFormatter formatter = new LayerFormatter();
  private GrappaNodeFactory nodeFactory = new GrappaNodeFactory();
  private GrappaEdgeFactory edgeFactory = new GrappaEdgeFactory();

  @Test
  public void testVisitFile() throws Exception {
    final VisualizationRequest requestDTO = new VisualizationRequest(1, LayoutViewType.CITY, 1, 20, ScmInfoType.AUTHOR_COUNT);

    final DaoService daoService = mock(DaoService.class);
    when(daoService.getMinMaxMetricValuesByRootSnapshotId(eq(requestDTO.getRootSnapshotId()), anyInt())).thenReturn(new MinMaxValue(0.0, 10.0));
    when(daoService.getMaxScmInfo(eq(requestDTO))).thenReturn(10);

    final Settings settings = new Settings();
    settings.setProperty(SoftVis3DConstants.DOT_BIN_KEY, "/usr/bin/dot");
    final SnapshotVisitorBean visitorBean =
      new SnapshotVisitorBean(formatter, dotExecutor, nodeFactory, edgeFactory, daoService, settings, requestDTO);

    final ValueTreeNode leaf = new ValueTreeNode(1, null, 0, TreeNodeType.TREE, "leaf1", 0.0, 10.0, 4);
    visitorBean.visitFile(leaf);
  }

  @Test
  public void testVisitFileDependency() throws Exception {
    final int id = 1;

    final DaoService daoService = mock(DaoService.class);
    when(daoService.getMinMaxMetricValuesByRootSnapshotId(eq(id), anyInt())).thenReturn(new MinMaxValue(0.0, 10.0));

    final Settings settings = new Settings();
    settings.setProperty(SoftVis3DConstants.DOT_BIN_KEY, "/usr/bin/dot");
    final VisualizationRequest requestDTO = new VisualizationRequest(1, LayoutViewType.DEPENDENCY, 1, 20, ScmInfoType.AUTHOR_COUNT);
    final SnapshotVisitorBean visitorBean =
      new SnapshotVisitorBean(formatter, dotExecutor, nodeFactory, edgeFactory, daoService, settings, requestDTO);

    final DependencyTreeNode leaf = new DependencyTreeNode(1, null, 0);
    visitorBean.visitFile(leaf);
  }
}
