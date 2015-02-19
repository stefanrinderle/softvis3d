/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.preprocessing.tree;

import com.google.inject.Inject;
import de.rinderle.softvis3d.dao.DaoService;
import de.rinderle.softvis3d.domain.sonar.SonarSnapshotBuilder;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.sonar.ModuleInfo;
import de.rinderle.softvis3d.domain.sonar.SonarSnapshot;
import de.rinderle.softvis3d.domain.tree.RootTreeNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class TreeBuilderBean implements TreeBuilder {

	private static final Logger LOGGER = LoggerFactory
			.getLogger(TreeBuilderBean.class);

	@Inject
	private DaoService daoService;

	@Override
	public RootTreeNode createTreeStructure(
			final VisualizationRequest requestDTO) {
		LOGGER.info("Create tree structure for id "
				+ requestDTO.getRootSnapshotId());
		final PathWalker pathWalker = new PathWalker(
				requestDTO.getRootSnapshotId());

    final List<ModuleInfo> modules = getModules(requestDTO.getRootSnapshotId());

    LOGGER.info("Number of modules: " + modules.size());

    if (!modules.isEmpty()) {
      for (ModuleInfo module : modules) {
        VisualizationRequest moduleTemp = new VisualizationRequest(
                module.getId(), requestDTO.getViewType(),
                requestDTO.getFootprintMetricId(), requestDTO.getHeightMetricId());

        SonarSnapshotBuilder builder =
                new SonarSnapshotBuilder(module.getId(), module.getName())
                        .footprintMetricValue(BigDecimal.ZERO)
                        .heightMetricValue(BigDecimal.ZERO);

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

	private void addModuleToTreeWalker(PathWalker pathWalker,
			final VisualizationRequest requestDTO, final String moduleName) {
    final List<SonarSnapshot> flatChildren = this.daoService
            .getFlatChildrenWithMetrics(requestDTO);

    for (final SonarSnapshot flatChild : flatChildren) {
      if (moduleName.length() > 0) {
        flatChild.setPath(moduleName + "/" + flatChild.getPath());
      }

      pathWalker.addPath(flatChild);
    }
  }

  private List<ModuleInfo> getModules(int rootSnapshotId) {
    List<ModuleInfo> result = this.daoService.getDirectModuleChildrenIds(rootSnapshotId);

    if (result == null || result.size() == 0) {
      result = new ArrayList<ModuleInfo>();
    }

    return result;
  }

}
