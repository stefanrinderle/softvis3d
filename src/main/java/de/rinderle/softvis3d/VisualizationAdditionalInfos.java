package de.rinderle.softvis3d;

import de.rinderle.softvis3d.domain.MinMaxValue;

/**
 * Created by stefanrinderle on 05.12.15.
 */
public class VisualizationAdditionalInfos {
    private final MinMaxValue minMaxMetricFootprint;
    private final MinMaxValue minMaxMetricHeight;
    private final int dependenciesCount;
    private final MinMaxValue minMaxMetricColor;

  public VisualizationAdditionalInfos(MinMaxValue minMaxMetricFootprint, MinMaxValue minMaxMetricHeight,
                                      MinMaxValue minMaxMetricColor, int dependenciesCount) {
        this.minMaxMetricFootprint = minMaxMetricFootprint;
        this.minMaxMetricHeight = minMaxMetricHeight;
        this.dependenciesCount = dependenciesCount;
        this.minMaxMetricColor = minMaxMetricColor;
    }

    public MinMaxValue getMinMaxMetricFootprint() {
        return minMaxMetricFootprint;
    }

    public MinMaxValue getMinMaxMetricHeight() {
        return minMaxMetricHeight;
    }

    public int getDependenciesCount() {
        return dependenciesCount;
    }

    public MinMaxValue getMinMaxMetricColor() {
        return minMaxMetricColor;
    }
}
