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

import com.google.inject.Inject;
import org.sonar.api.config.Settings;

import java.util.List;

public class SonarServiceImpl implements SonarService {

    @Inject
    private SonarDao sonarDao;

    @Override
    public Integer getMetric1FromSettings(Settings settings) {
        return sonarDao.getMetricIdByName(settings.getString("metric1"));
    }

    @Override
    public Integer getMetric2FromSettings(Settings settings) {
        return sonarDao.getMetricIdByName(settings.getString("metric2"));
    }

    @Override
    public List<Integer> getDefinedMetricsForSnapshot(Integer snapshotId) {
        Integer childId = sonarDao.getSnapshotIdById(snapshotId);

        return sonarDao.getDistinctMetricsBySnapshotId(childId);
    }

    @Override
    public List<Double> getMinMaxMetricValuesByRootSnapshotId(
            Integer rootSnapshotId, Integer footprintMetricId,
            Integer heightMetricId) {
        return sonarDao.getMinMaxMetricValuesByRootSnapshotId(rootSnapshotId,
                footprintMetricId, heightMetricId);
    }

    @Override
    public SonarSnapshot getSnapshotById(Integer snapshotId,
            Integer footprintMetricId, Integer heightMetricId, Integer depth) {
        return sonarDao.getSnapshotById(snapshotId, footprintMetricId, heightMetricId, depth);
    }

    @Override
    public List<SonarSnapshot> getSnapshotsByIds(List<Integer> childrenNodeIds, Integer footprintMetricId, Integer heightMetricId, int depth) {
        List<SonarSnapshot> result = sonarDao.getSnapshotsById(childrenNodeIds,
                footprintMetricId, heightMetricId, depth);

        return result;
    }

}
