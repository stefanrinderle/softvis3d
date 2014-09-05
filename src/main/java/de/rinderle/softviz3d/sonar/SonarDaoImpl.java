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

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.PersistenceException;
import javax.persistence.Query;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.database.DatabaseSession;
import org.sonar.api.resources.Scopes;

import com.google.inject.Singleton;

@Singleton
public class SonarDaoImpl implements SonarDao {

    private static final Logger LOGGER = LoggerFactory
            .getLogger(SonarDaoImpl.class);

    private DatabaseSession session;

    @Override
    public void setDatabaseSession(DatabaseSession session) {
        this.session = session;
    }

    @Override
    public SonarSnapshot getSnapshotById(Integer snapshotId,
            Integer footprintMetricId, Integer heightMetricId) {
        SonarSnapshot snapshot;

        try {
            session.start();
            Query query = session
                    .createNativeQuery("select s.id, p.name, s.depth, m1.value, m2.value from snapshots s "
                            + "INNER JOIN projects p ON s.project_id = p.id "
                            + "INNER JOIN project_measures m1 ON s.id = m1.snapshot_id "
                            + "INNER JOIN project_measures m2 ON s.id = m2.snapshot_id "
                            + "WHERE s.id = :snapshotId AND m1.metric_id = :footprintMetricId "
                            + "AND m2.metric_id = :heightMetricId");
            query.setParameter("snapshotId", snapshotId);
            query.setParameter("footprintMetricId", footprintMetricId);
            query.setParameter("heightMetricId", heightMetricId);

            Object[] result = (Object[]) query.getSingleResult();

            snapshot = castToJpaSnapshot(result);
        } catch (PersistenceException e) {
            LOGGER.error(e.getMessage(), e);
            snapshot = null;
        } finally {
            session.stop();
        }

        return snapshot;
    }

    @Override
    public List<SonarSnapshot> getSnapshotsById(List<Integer> childrenNodeIds,
            Integer footprintMetricId, Integer heightMetricId) {
        List<SonarSnapshot> snapshots = new ArrayList<SonarSnapshot>();

        try {
            session.start();
            Query query = session
                    .createNativeQuery("select s.id, p.name, s.depth, m1.value, m2.value from snapshots s "
                            + "INNER JOIN projects p ON s.project_id = p.id "
                            + "INNER JOIN project_measures m1 ON s.id = m1.snapshot_id "
                            + "INNER JOIN project_measures m2 ON s.id = m2.snapshot_id "
                            + "WHERE s.id IN (:snapshotIds) "
                            + "AND m1.metric_id = :footprintMetricId "
                            + "AND m2.metric_id = :heightMetricId");
            
            query.setParameter("snapshotIds", childrenNodeIds);
            query.setParameter("footprintMetricId", footprintMetricId);
            query.setParameter("heightMetricId", heightMetricId);

            List<Object[]> queryResult = (List<Object[]>) query.getResultList();

            
            for (Object[] object : queryResult) {
                snapshots.add(castToJpaSnapshot(object));
            }
//            snapshot = castToJpaSnapshot(result);
        } catch (PersistenceException e) {
            LOGGER.error("snapshotIds", childrenNodeIds.size());
            LOGGER.error(e.getMessage(), e);
        } finally {
            session.stop();
        }

        return snapshots;
    }
    
    private String createIdString(List<Integer> childrenNodeIds) {
        StringBuilder result = new StringBuilder();
        
        for (Integer childId : childrenNodeIds) {
            result.append(childId);
            result.append(",");
        }
        
        result.deleteCharAt(result.length() - 1);
        return result.toString();
    }

    private SonarSnapshot castToJpaSnapshot(Object[] result,
            BigDecimal metric2Value) {
        Integer id = (Integer) result[0];
        String name = (String) result[1];
        // TODO SRI depth stimmt nicht
        Integer depth = (Integer) result[2];
        BigDecimal footprintMetricValue = (BigDecimal) result[3];
        BigDecimal heightMetricValue = metric2Value;
        SonarSnapshot snapshot = new SonarSnapshot(id, name, depth,
                footprintMetricValue.doubleValue(),
                heightMetricValue.doubleValue());

        return snapshot;
    }

    private SonarSnapshot castToJpaSnapshot(Object[] result) {
        Integer id = (Integer) result[0];
        String name = (String) result[1];
        // TODO SRI depth stimmt nicht
        Integer depth = (Integer) result[2];
        BigDecimal footprintMetricValue = (BigDecimal) result[3];
        BigDecimal heightMetricValue = (BigDecimal) result[3];

        SonarSnapshot snapshot = new SonarSnapshot(id, name, depth,
                footprintMetricValue.doubleValue(),
                heightMetricValue.doubleValue());

        return snapshot;
    }

    /*
     * (non-Javadoc)
     * 
     * @see
     * de.rinderle.softviz3d.sonar.SonarDaoInterface#getChildrenByScope(java
     * .lang.Integer, java.lang.Integer, java.lang.Integer, java.lang.String)
     */
    @Override
    @SuppressWarnings("unchecked")
    public List<SonarSnapshot> getChildrenByScope(Integer snapshotId,
            Integer footprintMetricId, Integer heightMetricId, String scope) {
        List<SonarSnapshot> snapshots = new ArrayList<SonarSnapshot>();

        try {
            session.start();
            Query query = session
                    .createNativeQuery("select s.id, p.name, s.depth, m1.value from snapshots s "
                            + "INNER JOIN projects p ON s.project_id = p.id "
                            + "INNER JOIN project_measures m1 ON s.id = m1.snapshot_id "
                            + "WHERE s.parent_snapshot_id = :snapshotId AND s.scope = :scope AND "
                            + "m1.metric_id = :footprintMetricId");
            query.setParameter("snapshotId", snapshotId);
            query.setParameter("scope", scope);
            query.setParameter("footprintMetricId", footprintMetricId);

            List<Object[]> result = query.getResultList();
            for (Object[] resultElement : result) {
                query = session
                        .createNativeQuery("select m.value from snapshots s "
                                + "INNER JOIN project_measures m ON s.id = m.snapshot_id "
                                + "WHERE s.id = :snapshotId AND m.metric_id = :heightMetricId");
                query.setParameter("snapshotId", resultElement[0]);
                query.setParameter("heightMetricId", heightMetricId);

                BigDecimal metric2Value = (BigDecimal) query.getSingleResult();

                snapshots.add(castToJpaSnapshot(resultElement, metric2Value));
            }
        } catch (PersistenceException e) {
            LOGGER.error(e.getMessage(), e);
            snapshots = null;
        } finally {
            session.stop();
        }

        return snapshots;
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

    /*
     * (non-Javadoc)
     * 
     * @see de.rinderle.softviz3d.sonar.SonarDaoInterface#
     * getMinMaxMetricValuesByRootSnapshotId(java.lang.Integer,
     * java.lang.Integer, java.lang.Integer)
     */
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
    public List<Object[]> getAllChildrenFlat(int rootSnapshotId) {
        /**
         * SELECT s.id, p.path FROM snapshots s INNER JOIN projects p ON
         * s.project_id = p.id WHERE s.root_snapshot_id =340
         */
        List<Object[]> childrenIds;

        try {
            session.start();
            Query query = session
                    .createNativeQuery("SELECT s.id, p.path FROM snapshots s "
                            + "INNER JOIN projects p ON s.project_id = p.id "
                            + "WHERE s.root_snapshot_id = :id "
                            + "ORDER BY path");
            query.setParameter("id", rootSnapshotId);

            childrenIds = query.getResultList();
        } catch (PersistenceException e) {
            LOGGER.error(e.getMessage(), e);
            childrenIds = null;
        } finally {
            session.stop();
        }

        return childrenIds;
    }

}
