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
package de.rinderle.softvis3d.layout;

import com.google.inject.Inject;
import de.rinderle.softvis3d.VisualizationAdditionalInfos;
import de.rinderle.softvis3d.VisualizationSettings;
import de.rinderle.softvis3d.domain.SnapshotTreeResult;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.graph.ResultPlatform;
import de.rinderle.softvis3d.layout.bottomup.BottomUpLayout;
import de.rinderle.softvis3d.layout.bottomup.BottomUpLayoutBean;
import de.rinderle.softvis3d.layout.bottomup.SnapshotVisitor;
import de.rinderle.softvis3d.layout.bottomup.SnapshotVisitorBean;
import de.rinderle.softvis3d.layout.bottomup.grappa.GrappaEdgeFactory;
import de.rinderle.softvis3d.layout.bottomup.grappa.GrappaNodeFactory;
import de.rinderle.softvis3d.layout.dot.DotExecutor;
import de.rinderle.softvis3d.layout.dot.DotExecutorException;
import de.rinderle.softvis3d.layout.format.LayerFormatter;
import java.util.Map;

public class LayoutProcessor {

//  @Inject
//  private SnapshotVisitorFactory visitorFactory;

  @Inject
  private LayerFormatter formatter;
  @Inject
  private DotExecutor dotExcecutor;
  @Inject
  private GrappaNodeFactory nodeFactory;
  @Inject
  private GrappaEdgeFactory edgefactory;

  public Map<Integer, ResultPlatform> process(final VisualizationSettings settings, final VisualizationRequest requestDTO,
                                              final SnapshotTreeResult snapshotTreeResult, VisualizationAdditionalInfos additionalInfos) throws DotExecutorException {

    //    final SnapshotVisitor visitor = this.visitorFactory.create(settings, requestDTO);

    final SnapshotVisitor visitor = new SnapshotVisitorBean(formatter, dotExcecutor, nodeFactory, edgefactory,
            settings, requestDTO, additionalInfos);

    final BottomUpLayout bottomUpLayout = new BottomUpLayoutBean(visitor);
    bottomUpLayout.accept(snapshotTreeResult);

    return visitor.getResultingGraphList();
  }
}
