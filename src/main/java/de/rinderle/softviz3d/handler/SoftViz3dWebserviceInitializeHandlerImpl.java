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
package de.rinderle.softviz3d.handler;

import com.google.inject.Inject;
import de.rinderle.softviz3d.layout.calc.DependencyExpander;
import de.rinderle.softviz3d.layout.calc.LayoutViewType;
import de.rinderle.softviz3d.sonar.DependencyDao;
import de.rinderle.softviz3d.sonar.SonarDependency;
import de.rinderle.softviz3d.tree.ResourceTreeService;
import de.rinderle.softviz3d.tree.TreeNode;
import org.sonar.api.server.ws.Request;
import org.sonar.api.server.ws.Response;
import org.sonar.api.utils.text.JsonWriter;

import java.util.List;

public class SoftViz3dWebserviceInitializeHandlerImpl implements SoftViz3dWebserviceInitializeHandler {

  @Inject
  private ResourceTreeService resourceTreeService;
  @Inject
  private DependencyExpander dependencyExpander;
  @Inject
  private DependencyDao dependencyDao;
  @Inject
  private TreeNodeJsonWriter treeNodeJsonWriter;

  @Override
  public void handle(final Request request, final Response response) {
    final Integer id = Integer.valueOf(request.param("snapshotId"));
    final Integer footprintMetricId = Integer.valueOf(request.param("footprintMetricId"));
    final Integer heightMetricId = Integer.valueOf(request.param("heightMetricId"));

    final String viewType = request.param("viewType");
    final LayoutViewType type;
    if ("city".equals(viewType)) {
      type = LayoutViewType.CITY;
    } else {
      type = LayoutViewType.DEPENDENCY;
    }

    // TODO: do in one step
    final TreeNode tree = this.resourceTreeService.createTreeStructure(type, id, footprintMetricId, heightMetricId);
    if (LayoutViewType.DEPENDENCY.equals(type)) {
      final List<SonarDependency> dependencies = this.dependencyDao.getDependencies(id);
      this.dependencyExpander.execute(id, dependencies);
    }

    final JsonWriter jsonWriter = response.newJsonWriter();

    treeNodeJsonWriter.transformTreeToJson(jsonWriter, tree);

    jsonWriter.close();
  }

}
