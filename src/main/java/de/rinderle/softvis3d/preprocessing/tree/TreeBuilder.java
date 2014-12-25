/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.preprocessing.tree;

import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.tree.RootTreeNode;

/**
 * Created by stefan on 07.11.14.
 */
public interface TreeBuilder {
  RootTreeNode createTreeStructure(VisualizationRequest requestDTO);
}
