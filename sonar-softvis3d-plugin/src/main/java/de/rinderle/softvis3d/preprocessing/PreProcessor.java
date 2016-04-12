/*
 * SoftVis3D Sonar plugin
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
package de.rinderle.softvis3d.preprocessing;

import com.google.inject.Inject;
import de.rinderle.softvis3d.SoftVis3DPlugin;
import de.rinderle.softvis3d.base.domain.SnapshotTreeResult;
import de.rinderle.softvis3d.base.domain.tree.RootTreeNode;
import de.rinderle.softvis3d.cache.SnapshotCacheService;
import de.rinderle.softvis3d.domain.SnapshotStorageKey;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.preprocessing.tree.OptimizeTreeStructure;
import de.rinderle.softvis3d.preprocessing.tree.TreeBuilder;
import org.sonar.api.server.ws.LocalConnector;

public class PreProcessor {

  @Inject
  private TreeBuilder treeBuilder;
  @Inject
  private OptimizeTreeStructure optimizeTreeStructure;
  @Inject
  private SnapshotCacheService snapshotCacheService;

  public SnapshotTreeResult process(LocalConnector localConnector, final VisualizationRequest requestDTO) {
    snapshotCacheService.printCacheContents();

    final SnapshotStorageKey mapKey = new SnapshotStorageKey(requestDTO);

    final SnapshotTreeResult result;
    if (SoftVis3DPlugin.CACHE_ENABLED && snapshotCacheService.containsKey(mapKey)) {
      result = snapshotCacheService.getSnapshotTreeResult(mapKey);
    } else {
      final RootTreeNode tree = treeBuilder.createTreeStructure(localConnector, requestDTO);
      this.optimizeTreeStructure.removeUnnecessaryNodes(tree);

      result = new SnapshotTreeResult(tree);
      if (SoftVis3DPlugin.CACHE_ENABLED) {
        this.snapshotCacheService.save(mapKey, result);
      }
    }

    return result;
  }

}
