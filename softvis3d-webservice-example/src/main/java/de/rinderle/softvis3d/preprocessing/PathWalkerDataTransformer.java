package de.rinderle.softvis3d.preprocessing;

import de.rinderle.softvis3d.neoresult.Data;
import java.util.List;
import org.apache.commons.lang.StringUtils;

/**
 * Created by stefanrinderle on 15.12.15.
 */
public class PathWalkerDataTransformer {
  public PathWalkerInputElement transform(final Data data) {

    List<String> row = data.getRow();
    String path = row.get(0);
    double footprintMetricValue = getDoubleValue(row, 1);
    double heightMetricValue = getDoubleValue(row, 2);
    int colorMetricValue = getIntValue(row, 3);

    return new PathWalkerInputElement(footprintMetricValue, heightMetricValue, colorMetricValue, path);
  }

  private double getDoubleValue(final List<String> input, final int index) {
    if (indexExists(input, index) && StringUtils.isNotBlank(input.get(index))) {
      try {
        return Double.valueOf(input.get(index));
      } catch (NumberFormatException exception) {
        return 0;
      }
    }
    return 0;
  }

  private int getIntValue(final List<String> input, final int index) {
    if (indexExists(input, index) && StringUtils.isNotBlank(input.get(index))) {
      try {
        return Integer.valueOf(input.get(index));
      } catch (NumberFormatException exception) {
        return 0;
      }
    }
    return 0;
  }

  public boolean indexExists(final List list, final int index) {
    return index >= 0 && index < list.size();
  }
}
