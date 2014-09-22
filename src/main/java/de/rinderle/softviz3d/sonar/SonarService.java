/*
 * SoftViz3d Sonar plugin
 * Copyright (C) 2013 Stefan Rinderle
 * stefan@rinderle.info
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
package de.rinderle.softviz3d.sonar;

import org.sonar.api.config.Settings;

import java.util.List;

public interface SonarService {

    public abstract Integer getMetric1FromSettings(Settings settings);

    public abstract Integer getMetric2FromSettings(Settings settings);

    /**
     * Request all metrics which are set on the file level (Scope) for
     * the requested root snapshot.
     * 
     * @param snapshotId Root snapshot ID
     * @return defined metrics on the file level scope
     */
    public abstract List<Integer> getDefinedMetricsForSnapshot(
            Integer snapshotId);
    
    public abstract List<Double> getMinMaxMetricValuesByRootSnapshotId(
            Integer rootSnapshotId, Integer footprintMetricId,
            Integer heightMetricId);
    
    SonarSnapshot getSnapshotById(Integer snapshotId,
            Integer footprintMetricId, Integer heightMetricId, Integer depth);

    List<SonarSnapshot> getSnapshotsByIds(List<Integer> childrenNodeIds, Integer footprintMetricId, Integer heightMetricId, int depth);

    String getSnapshotDetails(Integer id, Integer footprintMetricId, Integer heightMetricId, Integer depth);
}