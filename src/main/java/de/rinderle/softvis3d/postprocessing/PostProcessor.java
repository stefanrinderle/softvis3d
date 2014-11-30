/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.postprocessing;

import de.rinderle.softvis3d.domain.LayoutViewType;
import de.rinderle.softvis3d.domain.SnapshotTreeResult;
import de.rinderle.softvis3d.domain.graph.ResultPlatform;

import java.util.Map;

public interface PostProcessor {
  int process(LayoutViewType viewType, Integer snapshotId, Map<Integer, ResultPlatform> resultGraphList,
    SnapshotTreeResult treeResult);
}
