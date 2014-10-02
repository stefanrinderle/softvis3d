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

import com.google.inject.Singleton;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.database.DatabaseSession;
import org.sonar.api.resources.Scopes;

import javax.persistence.PersistenceException;
import javax.persistence.Query;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Singleton
public class SonarDaoImpl implements SonarDao {

    private static final Logger LOGGER = LoggerFactory
            .getLogger(SonarDaoImpl.class);

    private DatabaseSession session;

    @Override
    public void setDatabaseSession(DatabaseSession session) {
        this.session = session;
    }

//    @Override
//    public SonarSnapshot getSnapshotById(Integer snapshotId,
//            Integer footprintMetricId, Integer heightMetricId, Integer depth) {
//        SonarSnapshot snapshot;
//
//        try {
//            session.start();
//            Query query = session
//                    .createNativeQuery("select s.id, p.name, m1.value, m2.value from snapshots s "
//                            + "INNER JOIN projects p ON s.project_id = p.id "
//                            + "INNER JOIN project_measures m1 ON s.id = m1.snapshot_id "
//                            + "INNER JOIN project_measures m2 ON s.id = m2.snapshot_id "
//                            + "WHERE s.id = :snapshotId AND m1.metric_id = :footprintMetricId "
//                            + "AND m2.metric_id = :heightMetricId");
//            query.setParameter("snapshotId", snapshotId);
//            query.setParameter("footprintMetricId", footprintMetricId);
//            query.setParameter("heightMetricId", heightMetricId);
//
//            Object[] result = (Object[]) query.getSingleResult();
//
//            Double heightMetric = getHeightMetricForSnapshot(snapshotId, heightMetricId);
//            snapshot = castToJpaSnapshot(result, depth, heightMetric);
//        } catch (PersistenceException e) {
//            LOGGER.error(e.getMessage(), e);
//            snapshot = null;
//        } finally {
//            session.stop();
//        }
//
//        return snapshot;
//    }

    @Override
    public String getSnapshotDetails(Integer snapshotId) {
        String resultString = "";

        try {
            session.start();
            Query query = session
                .createNativeQuery("select s.id, p.name from snapshots s "
                        + "INNER JOIN projects p ON s.project_id = p.id "
                        + "WHERE s.id = :snapshotId");
            query.setParameter("snapshotId", snapshotId);

            Object[] result = (Object[]) query.getSingleResult();

            resultString = result[0] + " " + result[1];
        } catch (PersistenceException e) {
            LOGGER.error(e.getMessage(), e);
        } finally {
            session.stop();
        }

        return resultString;
    }

//    @Override
//    public List<SonarSnapshot> getSnapshotsById(List<Integer> childrenNodeIds,
//            Integer footprintMetricId, Integer heightMetricId, Integer depth) {
//        List<SonarSnapshot> snapshots = new ArrayList<SonarSnapshot>();
//
//        try {
//            session.start();
//            Query query = session
//                    .createNativeQuery("select s.id, p.name, m1.value, m2.value from snapshots s "
//                            + "INNER JOIN projects p ON s.project_id = p.id "
//                            + "INNER JOIN project_measures m1 ON s.id = m1.snapshot_id "
//                            + "INNER JOIN project_measures m2 ON s.id = m2.snapshot_id "
//                            + "WHERE s.id IN (:snapshotIds) "
//                            + "AND m1.metric_id = :footprintMetricId "
//                            + "AND m2.metric_id = :heightMetricId");
//
//            query.setParameter("snapshotIds", childrenNodeIds);
//            query.setParameter("footprintMetricId", footprintMetricId);
//            query.setParameter("heightMetricId", heightMetricId);
//
//            List<Object[]> queryResult = (List<Object[]>) query.getResultList();
//
//            for (Object[] object : queryResult) {
//                Double heightMetricValue = getHeightMetricForSnapshot((Integer) object[0], heightMetricId);
//                snapshots.add(castToJpaSnapshot(object, depth, heightMetricValue));
//            }
//
//        } catch (PersistenceException e) {
//            LOGGER.error(e.getMessage(), e);
//        } finally {
//            session.stop();
//        }
//
//        return snapshots;
//    }

    private Double getHeightMetricForSnapshot(Integer snapshotId, Integer heightMetricId) {
            Query query = session
                    .createNativeQuery("select m.value from snapshots s "
                            + "INNER JOIN project_measures m ON s.id = m.snapshot_id "
                            + "WHERE s.id = :snapshotId AND m.metric_id = :heightMetricId");
            query.setParameter("snapshotId", snapshotId);
            query.setParameter("heightMetricId", heightMetricId);

            BigDecimal result = (BigDecimal) query.getSingleResult();

            return result.doubleValue();
    }

    @Override
    public Integer getSnapshotIdById(Integer snapshotId) {
        try {
            session.start();

            // search the first child
            Query query = session.createQuery("SELECT id FROM Snapshot s "
                    + "WHERE s.path LIKE :snapshotId AND s.scope = :scope");
            query.setMaxResults(1);

            query.setParameter("snapshotId", snapshotId + ".%");
            query.setParameter("scope", Scopes.FILE);
            return (Integer) query.getSingleResult();
        } catch (PersistenceException e) {
            LOGGER.error(e.getMessage(), e);
        } finally {
            session.stop();
        }

        return null;
    }

    @SuppressWarnings("unchecked")
    @Override
    public List<Integer> getDistinctMetricsBySnapshotId(Integer snapshotId) {
        List<Integer> metricIds;

        try {
            session.start();

            Query metricsQuery = session
                    .createQuery("SELECT distinct metricId "
                            + "FROM MeasureModel m WHERE m.snapshotId = :snapshotId "
                            + "AND m.value is not null");
            metricsQuery.setParameter("snapshotId", snapshotId);

            metricIds = metricsQuery.getResultList();
        } catch (PersistenceException e) {
            LOGGER.error(e.getMessage(), e);
            metricIds = null;
        } finally {
            session.stop();
        }

        return metricIds;
    }

    /*
     * (non-Javadoc)
     * 
     * @see
     * de.rinderle.softviz3d.sonar.SonarDaoInterface#getMetricIdByName(java.
     * lang.String)
     */
    @Override
    public Integer getMetricIdByName(String name) {
        Integer metricId;

        try {
            session.start();
            Query query = session
                    .createNativeQuery("SELECT id FROM metrics m WHERE m.name = :name");
            query.setParameter("name", name);

            metricId = (Integer) query.getSingleResult();
        } catch (PersistenceException e) {
            LOGGER.error(e.getMessage(), e);
            metricId = null;
        } finally {
            session.stop();
        }

        return metricId;
    }

    @Override
    public List<Double> getMinMaxMetricValuesByRootSnapshotId(
            Integer rootSnapshotId, Integer footprintMetricId,
            Integer heightMetricId) {
        List<Double> values = new ArrayList<Double>();

        try {
            session.start();
            Query query = session
                    .createNativeQuery("select MIN(m1.value), MAX(m1.value), MIN(m2.value), MAX(m2.value) from snapshots s "
                            + "INNER JOIN project_measures m1 ON s.id = m1.snapshot_id "
                            + "INNER JOIN project_measures m2 ON s.id = m2.snapshot_id "
                            + "WHERE s.path LIKE :rootSnapshotId AND m1.metric_id = :footprintMetricId AND "
                            + "m2.metric_id = :heightMetricId AND "
                            + "s.scope != 'PRJ' AND s.scope != 'DIR'");
            query.setParameter("rootSnapshotId", rootSnapshotId + ".%");
            query.setParameter("footprintMetricId", footprintMetricId);
            query.setParameter("heightMetricId", heightMetricId);

            Object[] result = (Object[]) query.getSingleResult();
            values.add(((BigDecimal) result[0]).doubleValue());
            values.add(((BigDecimal) result[1]).doubleValue());
            values.add(((BigDecimal) result[2]).doubleValue());
            values.add(((BigDecimal) result[3]).doubleValue());

        } catch (PersistenceException e) {
            LOGGER.error(e.getMessage(), e);
            values = null;
        } finally {
            session.stop();
        }

        return values;
    }

    @Override
    public List<Object[]> getAllProjectElements(int rootSnapshotId,
           int footprintMetricId, int heightMetricId) {
        /**
         * SELECT s.id, p.path FROM snapshots s INNER JOIN projects p ON
         * s.project_id = p.id WHERE s.root_snapshot_id =340
         */
        List<Object[]> result;

        try {
            session.start();
            Query query = session
                    .createNativeQuery(
            "SELECT s.id, p.path, m1.value, m2.value " +
                    "FROM snapshots s " +
                    "INNER JOIN projects p ON s.project_id = p.id " +
                    "INNER JOIN project_measures m1 ON s.id = m1.snapshot_id " +
                    "INNER JOIN project_measures m2 ON s.id = m2.snapshot_id " +
                    "WHERE m1.metric_id = :footprintMetricId " +
                    "AND m2.metric_id = :heightMetricId " +
                    "AND s.root_snapshot_id = :id " +
                    "ORDER BY path");
            query.setParameter("id", rootSnapshotId);
            query.setParameter("footprintMetricId", footprintMetricId);
            query.setParameter("heightMetricId", heightMetricId);

            result = query.getResultList();
        } catch (PersistenceException e) {
            LOGGER.error(e.getMessage(), e);
            result = null;
        } finally {
            session.stop();
        }

        return result;
    }

}
