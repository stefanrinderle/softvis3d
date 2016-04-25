package de.rinderle.softvis3d.webservice;

import de.rinderle.softvis3d.base.domain.MinMaxValue;
import de.rinderle.softvis3d.base.domain.tree.RootTreeNode;
import de.rinderle.softvis3d.base.domain.tree.ValueTreeNode;
import java.util.List;

class MinMaxCalculator {

  private final List<ValueTreeNode> valueLeaves;

  MinMaxCalculator(RootTreeNode tree) {
    this.valueLeaves = tree.getAllChildrenValueLeaves();
  }

  MinMaxValue getMinMaxForFootprintMetric() {
    double minResult = valueLeaves.get(0).getFootprintMetricValue();
    double maxResult = valueLeaves.get(0).getFootprintMetricValue();
    for (final ValueTreeNode valueNode : valueLeaves) {

      if (valueNode.getFootprintMetricValue() < minResult) {
        minResult = valueNode.getFootprintMetricValue();
      }
      if (valueNode.getFootprintMetricValue() > maxResult) {
        maxResult = valueNode.getFootprintMetricValue();
      }
    }

    return new MinMaxValue(minResult, maxResult);
  }

  MinMaxValue getMinMaxForHeightMetric() {

    double minResult = valueLeaves.get(0).getHeightMetricValue();
    double maxResult = valueLeaves.get(0).getHeightMetricValue();

    for (final ValueTreeNode valueNode : valueLeaves) {
      if (valueNode.getHeightMetricValue() < minResult) {
        minResult = valueNode.getHeightMetricValue();
      }

      if (valueNode.getHeightMetricValue() > maxResult) {
        maxResult = valueNode.getHeightMetricValue();
      }
    }

    return new MinMaxValue(minResult, maxResult);
  }

  MinMaxValue getMinMaxForColorMetric() {

    double minResult = valueLeaves.get(0).getColorMetricValue();
    double maxResult = valueLeaves.get(0).getColorMetricValue();

    for (final ValueTreeNode valueNode : valueLeaves) {
      if (valueNode.getColorMetricValue() < minResult) {
        minResult = valueNode.getColorMetricValue();
      }

      if (valueNode.getColorMetricValue() > maxResult) {
        maxResult = valueNode.getColorMetricValue();
      }
    }

    return new MinMaxValue(minResult, maxResult);
  }
}