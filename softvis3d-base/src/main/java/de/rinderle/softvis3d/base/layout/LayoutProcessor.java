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
package de.rinderle.softvis3d.base.layout;

import com.google.inject.Inject;
import de.rinderle.softvis3d.base.VisualizationAdditionalInfos;
import de.rinderle.softvis3d.base.VisualizationSettings;
import de.rinderle.softvis3d.base.domain.SnapshotTreeResult;
import de.rinderle.softvis3d.base.domain.graph.ResultPlatform;
import de.rinderle.softvis3d.base.layout.bottomup.BottomUpLayout;
import de.rinderle.softvis3d.base.layout.bottomup.BottomUpLayoutBean;
import de.rinderle.softvis3d.base.layout.bottomup.SnapshotVisitor;
import de.rinderle.softvis3d.base.layout.bottomup.SnapshotVisitorBean;
import de.rinderle.softvis3d.base.layout.bottomup.grappa.GrappaEdgeFactory;
import de.rinderle.softvis3d.base.layout.bottomup.grappa.GrappaNodeFactory;
import de.rinderle.softvis3d.base.layout.dot.DotExecutor;
import de.rinderle.softvis3d.base.layout.dot.DotExecutorException;
import de.rinderle.softvis3d.base.layout.format.LayerFormatter;
import java.util.Map;

public class LayoutProcessor {

  // @Inject
  // private SnapshotVisitorFactory visitorFactory;

  @Inject
  private LayerFormatter formatter;
  @Inject
  private DotExecutor dotExcecutor;
  @Inject
  private GrappaNodeFactory nodeFactory;
  @Inject
  private GrappaEdgeFactory edgefactory;

  public Map<String, ResultPlatform> process(final VisualizationSettings settings,
                                              final SnapshotTreeResult snapshotTreeResult, final VisualizationAdditionalInfos additionalInfos) throws DotExecutorException {

    // final SnapshotVisitor visitor = this.visitorFactory.create(settings, requestDTO);

    final SnapshotVisitor visitor = new SnapshotVisitorBean(formatter, dotExcecutor, nodeFactory, edgefactory,
      settings, additionalInfos);

    final BottomUpLayout bottomUpLayout = new BottomUpLayoutBean(visitor);
    bottomUpLayout.accept(snapshotTreeResult);

    return visitor.getResultingGraphList();
  }
}
