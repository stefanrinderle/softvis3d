/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.preprocessing.tree;

import com.google.inject.Inject;
import de.rinderle.softvis3d.dao.DaoService;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.sonar.SonarSnapshot;
import de.rinderle.softvis3d.domain.tree.RootTreeNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

public class TreeBuilderBean implements TreeBuilder {

  private static final Logger LOGGER = LoggerFactory.getLogger(TreeBuilderBean.class);

  @Inject
  private DaoService daoService;

  @Override
  public RootTreeNode createTreeStructure(final VisualizationRequest requestDTO) {
    LOGGER.info("Created tree structure for id " + requestDTO.getRootSnapshotId());
    final PathWalker pathWalker = new PathWalker(requestDTO.getRootSnapshotId());

    final List<SonarSnapshot> flatChildren =
      this.daoService.getFlatChildrenWithMetrics(requestDTO);

    for (final SonarSnapshot flatChild : flatChildren) {
      pathWalker.addPath(flatChild);
    }

    return pathWalker.getTree();
  }

}
