/**
 * SoftVis3D Sonar plugin
 * Copyright (C) 2016 Stefan Rinderle and Yvo Niedrich
 * stefan@rinderle.info / yvo.niedrich@gmail.com
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
package de.rinderle.softvis3d.preprocessing.tree;

import com.google.inject.Inject;
import de.rinderle.softvis3d.base.domain.tree.RootTreeNode;
import de.rinderle.softvis3d.dao.DaoService;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.sonar.SonarMeasure;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.server.ws.LocalConnector;

public class TreeBuilder {

  private static final Logger LOGGER = LoggerFactory.getLogger(TreeBuilder.class);

  @Inject
  private DaoService daoService;

  public RootTreeNode createTreeStructure(LocalConnector localConnector, final VisualizationRequest requestDTO) {
    LOGGER.info("Create tree structure for id " + requestDTO.getRootSnapshotKey());
    final PathWalker pathWalker = new PathWalker(requestDTO.getRootSnapshotKey());

    final List<SonarMeasure> modules = getModules(localConnector, requestDTO.getRootSnapshotKey());

    LOGGER.info("Number of modules: " + modules.size());

    if (modules.isEmpty()) {
      addModuleToTreeWalker(pathWalker, requestDTO, "", localConnector);
    } else {
      for (final SonarMeasure module : modules) {
        final VisualizationRequest moduleTemp =
            new VisualizationRequest(module.getId(),
                requestDTO.getFootprintMetricKey(), requestDTO.getHeightMetricKey(), requestDTO.getColorMetricType());

        addModuleToTreeWalker(pathWalker, moduleTemp, module.getName(), localConnector);
      }
    }

    return pathWalker.getTree();
  }

  private void addModuleToTreeWalker(final PathWalker pathWalker, final VisualizationRequest requestDTO,
                                     final String moduleName, LocalConnector localConnector) {
    final List<SonarMeasure> flatChildren = this.daoService.getFlatChildrenWithMetrics(localConnector, requestDTO);

    for (final SonarMeasure flatChild : flatChildren) {
      if (!moduleName.isEmpty()) {
        flatChild.setPath(moduleName + "/" + flatChild.getPath());
      }

      pathWalker.addPath(flatChild);
    }
  }

  private List<SonarMeasure> getModules(LocalConnector localConnector, final String rootSnapshotId) {
    List<SonarMeasure> result = this.daoService.getSubProjects(localConnector, rootSnapshotId);

    if (result == null || result.isEmpty()) {
      result = new ArrayList<>();
    }

    return result;
  }

}
