/**
 * SoftVis3D Sonar plugin
 * Copyright (C) 2016 Stefan Rinderle and Yvo Niedrich
 * stefan@rinderle.info / yvo.niedrich@gmail.com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
 */
package de.rinderle.softvis3d.dao;

import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.sonar.SonarMeasure;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.sonarqube.ws.WsComponents;
import org.sonarqube.ws.WsMeasures;

class DaoServiceTransformer {

  List<SonarMeasure> transformComponentToModules(List<WsComponents.Component> input) {
    final List<SonarMeasure> result = new ArrayList<>();

    for (final WsComponents.Component component : input) {
      result.add(new SonarMeasure(component.getId(), component.getName(), component.getPath(), 0.0, 0.0, 0.0));
    }

    return result;
  }

  List<SonarMeasure> transformComponentToMeasure(List<WsMeasures.Component> input, VisualizationRequest requestDTO) {
    final List<SonarMeasure> result = new ArrayList<>();

    for (final WsMeasures.Component component : input) {

      double footprintMetricValue = 0;
      double heightMetricValue = 0;
      double colorMetricValue = 0;

      for (final WsMeasures.Measure measure : component.getMeasuresList()) {

        if (measure.getMetric().equals(requestDTO.getFootprintMetricKey())
          && !StringUtils.isBlank(measure.getValue())) {
          footprintMetricValue = Double.valueOf(measure.getValue());
        }

        if (measure.getMetric().equals(requestDTO.getHeightMetricKey())
          && !StringUtils.isBlank(measure.getValue())) {
          heightMetricValue = Double.valueOf(measure.getValue());
        }

        if (measure.getMetric().equals(requestDTO.getColorMetricType().getDefaultMetricName())
          && !StringUtils.isBlank(measure.getValue())) {
          colorMetricValue = Double.valueOf(measure.getValue());
        }

      }

      result.add(new SonarMeasure(component.getId(), component.getName(), component.getPath(),
        footprintMetricValue, heightMetricValue, colorMetricValue));
    }

    return result;
  }

}
