package de.rinderle.softviz3d.sonar;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.database.DatabaseSession;

import javax.persistence.PersistenceException;
import javax.persistence.Query;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class SonarDao {

  private static final Logger LOGGER = LoggerFactory
      .getLogger(SonarDao.class);

  private DatabaseSession session;

  public SonarDao(DatabaseSession session) {
    this.session = session;
  }

  public SonarSnapshotJpa getSnapshotById(Integer snapshotId, Integer footprintMetricId, Integer heightMetricId) {
    SonarSnapshotJpa snapshot;

    try {
      session.start();
      Query query = session
          .createNativeQuery("select s.id, p.name, s.depth, m1.value, m2.value from snapshots s " +
            "INNER JOIN projects p ON s.project_id = p.id " +
            "INNER JOIN project_measures m1 ON s.id = m1.snapshot_id " +
            "INNER JOIN project_measures m2 ON s.id = m2.snapshot_id " +
            "WHERE s.id = :snapshotId AND m1.metric_id = :footprintMetricId AND m2.metric_id = :heightMetricId");
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

  private SonarSnapshotJpa castToJpaSnapshot(Object[] result) {
    Integer id = (Integer) result[0];
    String name = (String) result[1];
    Integer depth = (Integer) result[2];
    BigDecimal footprintMetricValue = (BigDecimal) result[3];
    BigDecimal heightMetric2Value = (BigDecimal) result[4];

    return new SonarSnapshotJpa(id, name, depth, footprintMetricValue.doubleValue(), heightMetric2Value.doubleValue());
  }

  @SuppressWarnings("unchecked")
  public List<Integer> getSnapshotChildrenIdsById(Integer id) {
    List<Integer> childrenIds;

    try {
      session.start();
      Query query = session
          .createQuery("select s.id from Snapshot s where s.parentId = :id");
      query.setParameter("id", id);

      childrenIds = (List<Integer>) query.getResultList();
    } catch (PersistenceException e) {
      LOGGER.error(e.getMessage(), e);
      childrenIds = null;
    } finally {
      session.stop();
    }

    return childrenIds;
  }

  @SuppressWarnings("unchecked")
  public List<SonarSnapshotJpa> getChildrenByScope(Integer snapshotId, Integer footprintMetricId, Integer heightMetricId, String scope) {
    List<SonarSnapshotJpa> snapshots = new ArrayList<SonarSnapshotJpa>();

    try {
      session.start();
      Query query = session
          .createNativeQuery("select s.id, p.name, s.depth, m1.value, m2.value from snapshots s " +
            "INNER JOIN projects p ON s.project_id = p.id " +
            "INNER JOIN project_measures m1 ON s.id = m1.snapshot_id " +
            "INNER JOIN project_measures m2 ON s.id = m2.snapshot_id " +
            "WHERE s.parent_snapshot_id = :snapshotId AND s.scope = :scope AND m1.metric_id = :footprintMetricId AND m2.metric_id = :heightMetricId");
      query.setParameter("snapshotId", snapshotId);
      query.setParameter("scope", scope);
      query.setParameter("footprintMetricId", footprintMetricId);
      query.setParameter("heightMetricId", heightMetricId);

      List<Object[]> result = query.getResultList();
      for (Object[] resultElement : result) {
        snapshots.add(castToJpaSnapshot(resultElement));
      }
    } catch (PersistenceException e) {
      LOGGER.error(e.getMessage(), e);
      snapshots = null;
    } finally {
      session.stop();
    }

    return snapshots;
  }

  public List<Double> getMinMaxMetricValuesByRootSnapshotId(Integer rootSnapshotId, Integer footprintMetricId, Integer heightMetricId) {
    List<Double> values = new ArrayList<Double>();

    try {
      session.start();
      Query query = session
          .createNativeQuery("select MIN(m1.value), MAX(m1.value), MIN(m2.value), MAX(m2.value) from snapshots s " +
            "INNER JOIN project_measures m1 ON s.id = m1.snapshot_id " +
            "INNER JOIN project_measures m2 ON s.id = m2.snapshot_id " +
            "WHERE s.path LIKE :rootSnapshotId AND m1.metric_id = :footprintMetricId AND m2.metric_id = :heightMetricId");
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
}
