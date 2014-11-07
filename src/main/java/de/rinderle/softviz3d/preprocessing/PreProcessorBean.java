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
package de.rinderle.softviz3d.preprocessing;

import com.google.inject.Inject;
import de.rinderle.softviz3d.cache.SnapshotCacheService;
import de.rinderle.softviz3d.domain.SnapshotStorageKey;
import de.rinderle.softviz3d.domain.VisualizationRequest;
import de.rinderle.softviz3d.domain.tree.TreeNode;
import de.rinderle.softviz3d.dto.SonarDependencyDTO;
import de.rinderle.softviz3d.layout.calc.LayoutViewType;
import de.rinderle.softviz3d.preprocessing.dependencies.DependencyExpander;
import de.rinderle.softviz3d.preprocessing.tree.OptimizeTreeStructure;
import de.rinderle.softviz3d.preprocessing.tree.TreeBuilder;
import de.rinderle.softviz3d.sonar.SonarService;

import java.util.List;

public class PreProcessorBean implements PreProcessor {

  @Inject
  private TreeBuilder treeBuilder;
  @Inject
  private OptimizeTreeStructure optimizeTreeStructure;
  @Inject
  private SnapshotCacheService snapshotCacheService;
  @Inject
  private SonarService sonarService;
  @Inject
  private DependencyExpander dependencyExpander;

  @Override
  public SnapshotTreeResult process(VisualizationRequest requestDTO) {
    // TODO: do in one step
    int maxEdgeCounter = 0;
    // final String mapKey = this.resourceTreeService.getOrCreateTreeStructure(requestDTO);

    snapshotCacheService.printCacheContents();

    final SnapshotStorageKey mapKey = new SnapshotStorageKey(requestDTO);

    if (!snapshotCacheService.containsKey(mapKey)) {
      final TreeNode tree = treeBuilder.createTreeStructure(requestDTO);
      this.optimizeTreeStructure.removeUnnecessaryNodes(tree);
      snapshotCacheService.save(mapKey, tree);
    }

    if (LayoutViewType.DEPENDENCY.equals(requestDTO.getViewType())) {
      final List<SonarDependencyDTO> dependencies = this.sonarService.getDependencies(requestDTO.getRootSnapshotId());
      maxEdgeCounter = this.dependencyExpander.execute(mapKey, dependencies);
    }

    return new SnapshotTreeResult(mapKey, maxEdgeCounter);
  }

}
