package de.rinderle.softvis3d.webservice;

import de.rinderle.softvis3d.base.domain.MinMaxValue;
import de.rinderle.softvis3d.base.domain.tree.RootTreeNode;
import de.rinderle.softvis3d.base.domain.tree.ValueTreeNode;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by stefanrinderle on 12.04.16.
 */
public class MinMaxCalculator {

  private static final Logger LOGGER = LoggerFactory.getLogger(VisualizationWebserviceHandler.class);

  private final List<ValueTreeNode> valueLeaves;

  public MinMaxCalculator(RootTreeNode tree) {
    this.valueLeaves = tree.getAllChildrenValueLeaves();
  }

  public MinMaxValue getMinMaxForFootprintMetric() {
    double minResult = valueLeaves.get(0).getFootprintMetricValue();
    double maxresult = valueLeaves.get(0).getFootprintMetricValue();
    for (final ValueTreeNode valueNode : valueLeaves) {

      LOGGER.info(valueNode.getName() + " " + valueNode.getFootprintMetricValue() + " " + valueNode.getHeightMetricValue());

      if (valueNode.getFootprintMetricValue() < minResult) {
        minResult = valueNode.getFootprintMetricValue();
      }
      if (valueNode.getFootprintMetricValue() > maxresult) {
        maxresult = valueNode.getFootprintMetricValue();
      }
    }

    return new MinMaxValue(minResult, maxresult);
  }

  public MinMaxValue getMinMaxForHeightMetric() {

    double minResult = valueLeaves.get(0).getHeightMetricValue();
    double maxresult = valueLeaves.get(0).getHeightMetricValue();

    for (final ValueTreeNode valueNode : valueLeaves) {
      if (valueNode.getHeightMetricValue() < minResult) {
        minResult = valueNode.getHeightMetricValue();
      }

      if (valueNode.getHeightMetricValue() > maxresult) {
        maxresult = valueNode.getHeightMetricValue();
      }
    }

    return new MinMaxValue(minResult, maxresult);
  }

}