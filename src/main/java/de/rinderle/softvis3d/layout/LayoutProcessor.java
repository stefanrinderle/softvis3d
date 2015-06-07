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
import de.rinderle.softvis3d.domain.SnapshotTreeResult;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.graph.ResultPlatform;
import de.rinderle.softvis3d.guice.SnapshotVisitorFactory;
import de.rinderle.softvis3d.layout.bottomUp.BottomUpLayout;
import de.rinderle.softvis3d.layout.bottomUp.BottomUpLayoutBean;
import de.rinderle.softvis3d.layout.bottomUp.SnapshotVisitor;
import de.rinderle.softvis3d.layout.dot.DotExecutorException;
import org.sonar.api.config.Settings;

import java.util.Map;

public class LayoutProcessor {

  @Inject
  private SnapshotVisitorFactory visitorFactory;

  public Map<Integer, ResultPlatform> process(Settings settings, VisualizationRequest requestDTO,
    SnapshotTreeResult snapshotTreeResult) throws DotExecutorException {

    final SnapshotVisitor visitor = this.visitorFactory.create(settings, requestDTO);

    final BottomUpLayout bottomUpLayout = new BottomUpLayoutBean(visitor);
    bottomUpLayout.accept(snapshotTreeResult);

    return visitor.getResultingGraphList();
  }
}
