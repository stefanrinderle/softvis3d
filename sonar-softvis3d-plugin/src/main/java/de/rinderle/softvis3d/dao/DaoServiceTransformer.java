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

import de.rinderle.softvis3d.domain.sonar.SonarMeasure;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.sonarqube.ws.WsComponents;
import org.sonarqube.ws.WsMeasures;

class DaoServiceTransformer {

  List<SonarMeasure> transformComponentToModules(List<WsComponents.Component> input) {
    final List<SonarMeasure> result = new ArrayList<>();

    for (final WsComponents.Component component : input) {
      result.add(new SonarMeasure(component.getId(), component.getName(), component.getPath(), Collections.emptyMap()));
    }

    return result;
  }

  List<SonarMeasure> transformComponentToMeasure(List<WsMeasures.Component> input) {
    final List<SonarMeasure> result = new ArrayList<>();

    for (final WsMeasures.Component component : input) {

      final Map<String, Double> measureResult = new HashMap<>();
      for (final WsMeasures.Measure measure : component.getMeasuresList()) {

        if (!StringUtils.isBlank(measure.getValue())) {
          measureResult.put(measure.getMetric(), Double.valueOf(measure.getValue()));
        }

      }

      result.add(new SonarMeasure(component.getId(), component.getName(), component.getPath(), measureResult));
    }

    return result;
  }
}
