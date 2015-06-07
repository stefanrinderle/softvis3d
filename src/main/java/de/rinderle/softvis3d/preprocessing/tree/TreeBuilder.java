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
package de.rinderle.softvis3d.preprocessing.tree;

import com.google.inject.Inject;
import de.rinderle.softvis3d.dao.DaoService;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.sonar.ModuleInfo;
import de.rinderle.softvis3d.domain.sonar.SonarSnapshot;
import de.rinderle.softvis3d.domain.sonar.SonarSnapshotBuilder;
import de.rinderle.softvis3d.domain.tree.RootTreeNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

public class TreeBuilder {

  private static final Logger LOGGER = LoggerFactory.getLogger(TreeBuilder.class);

  @Inject
  private DaoService daoService;

  public RootTreeNode createTreeStructure(final VisualizationRequest requestDTO) {
    LOGGER.info("Create tree structure for id " + requestDTO.getRootSnapshotId());
    final PathWalker pathWalker = new PathWalker(requestDTO.getRootSnapshotId());

    final List<ModuleInfo> modules = getModules(requestDTO.getRootSnapshotId());

    LOGGER.info("Number of modules: " + modules.size());

    if (!modules.isEmpty()) {
      for (ModuleInfo module : modules) {
        VisualizationRequest moduleTemp =
          new VisualizationRequest(module.getId(), requestDTO.getViewType(),
            requestDTO.getFootprintMetricId(), requestDTO.getHeightMetricId());

        SonarSnapshotBuilder builder = new SonarSnapshotBuilder(module.getId()).withPath(module.getName());

        SonarSnapshot moduleElement = builder.build();
        LOGGER.info(moduleElement.toString());
        pathWalker.addPath(moduleElement);

        addModuleToTreeWalker(pathWalker, moduleTemp, module.getName());
      }
    } else {
      addModuleToTreeWalker(pathWalker, requestDTO, "");
    }

    return pathWalker.getTree();
  }

  private void addModuleToTreeWalker(PathWalker pathWalker, final VisualizationRequest requestDTO,
    final String moduleName) {
    final List<SonarSnapshot> flatChildren = this.daoService.getFlatChildrenWithMetrics(requestDTO);

    for (final SonarSnapshot flatChild : flatChildren) {
      if (moduleName.length() > 0) {
        flatChild.setPath(moduleName + "/" + flatChild.getPath());
      }

      pathWalker.addPath(flatChild);
    }
  }

  private List<ModuleInfo> getModules(int rootSnapshotId) {
    List<ModuleInfo> result = this.daoService.getDirectModuleChildrenIds(rootSnapshotId);

    if (result == null || result.isEmpty()) {
      result = new ArrayList<>();
    }

    return result;
  }

}
