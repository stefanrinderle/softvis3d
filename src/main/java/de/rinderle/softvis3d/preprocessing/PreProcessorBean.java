/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.preprocessing;

import com.google.inject.Inject;
import de.rinderle.softvis3d.cache.SnapshotCacheService;
import de.rinderle.softvis3d.dao.DaoService;
import de.rinderle.softvis3d.domain.LayoutViewType;
import de.rinderle.softvis3d.domain.SnapshotStorageKey;
import de.rinderle.softvis3d.domain.SnapshotTreeResult;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.sonar.SonarDependency;
import de.rinderle.softvis3d.domain.tree.RootTreeNode;
import de.rinderle.softvis3d.preprocessing.dependencies.DependencyExpander;
import de.rinderle.softvis3d.preprocessing.tree.OptimizeTreeStructure;
import de.rinderle.softvis3d.preprocessing.tree.TreeBuilder;

import java.util.List;

public class PreProcessorBean implements PreProcessor {

	@Inject
	private TreeBuilder treeBuilder;
	@Inject
	private OptimizeTreeStructure optimizeTreeStructure;
	@Inject
	private SnapshotCacheService snapshotCacheService;
	@Inject
	private DaoService daoService;
	@Inject
	private DependencyExpander dependencyExpander;

	@Override
	public SnapshotTreeResult process(VisualizationRequest requestDTO) {
		int dependencyCount = 0;
		snapshotCacheService.printCacheContents();

		final SnapshotStorageKey mapKey = new SnapshotStorageKey(requestDTO);

		final SnapshotTreeResult result;
		if (snapshotCacheService.containsKey(mapKey)) {
			result = snapshotCacheService.getSnapshotTreeResult(mapKey);
		} else {
			final RootTreeNode tree = treeBuilder
					.createTreeStructure(requestDTO);
			this.optimizeTreeStructure.removeUnnecessaryNodes(tree);

			if (LayoutViewType.DEPENDENCY.equals(requestDTO.getViewType())) {
				final List<SonarDependency> dependencies = this.daoService
						.getDependencies(requestDTO.getRootSnapshotId());
				this.dependencyExpander.execute(tree, dependencies);
				dependencyCount = dependencies.size();
			}

			result = new SnapshotTreeResult(mapKey, tree, dependencyCount);
			this.snapshotCacheService.save(result);
		}

		return result;
	}

}
