/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.domain.tree;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ValueTreeNode extends TreeNode {

  private static final Logger LOGGER = LoggerFactory.getLogger(ValueTreeNode.class);

  private final double heightMetricValue;
  private final double footprintMetricValue;

  public ValueTreeNode(final Integer id, final TreeNode parent, final int depth, final TreeNodeType type, final String name,
                       final double footprintMetricValue,
                       final double heightMetricValue) {
    super(id, parent, depth, type, name);

    this.footprintMetricValue = footprintMetricValue;
    this.heightMetricValue = heightMetricValue;
  }

  public double getHeightMetricValue() {
    return this.heightMetricValue;
  }

  public double getFootprintMetricValue() {
    return this.footprintMetricValue;
  }

}
