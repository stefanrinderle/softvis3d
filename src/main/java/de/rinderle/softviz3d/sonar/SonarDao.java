package de.rinderle.softviz3d.sonar;

import de.rinderle.softviz3d.SoftViz3dExtension;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.database.DatabaseSession;
import org.sonar.api.measures.Metric;

import javax.persistence.PersistenceException;
import javax.persistence.Query;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class SonarDao {

  private static final Logger LOGGER = LoggerFactory
      .getLogger(SoftViz3dExtension.class);

  private DatabaseSession session;

  public SonarDao(DatabaseSession session) {
    this.session = session;
  }

  public SonarSnapshotJpa getSnapshotById(Integer snapshotId, Integer metric1, Integer metric2) {
    SonarSnapshotJpa snapshot;

    try {
      session.start();
      Query query = session
          .createNativeQuery("select s.id, p.name, s.depth, m1.value, m2.value from snapshots s " +
            "INNER JOIN projects p ON s.project_id = p.id " +
            "INNER JOIN project_measures m1 ON s.id = m1.snapshot_id " +
            "INNER JOIN project_measures m2 ON s.id = m2.snapshot_id " +
            "WHERE s.id = :snapshotId AND m1.metric_id = :metricId1 AND m2.metric_id = :metricId2");
      query.setParameter("snapshotId", snapshotId);
      query.setParameter("metricId1", metric1);
      query.setParameter("metricId2", metric2);

      Object[] result = (Object[]) query.getSingleResult();
      Integer id = (Integer) result[0];
      String name = (String) result[1];
      Integer depth = (Integer) result[2];
      BigDecimal metric1Value = (BigDecimal) result[3];
      BigDecimal metric2Value = (BigDecimal) result[4];

      snapshot = new SonarSnapshotJpa(id, name, depth, metric1Value.doubleValue(), metric2Value.doubleValue());
    } catch (PersistenceException e) {
      LOGGER.error(e.getMessage(), e);
      snapshot = null;
    } finally {
      session.stop();
    }

    return snapshot;
  }

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
  public List<SonarSnapshotJpa> getChildrenByScope(Integer snapshotId, Integer metric1, Integer metric2, String scope) {
    List<SonarSnapshotJpa> snapshots = new ArrayList<SonarSnapshotJpa>();

    try {
      session.start();
      Query query = session
          .createNativeQuery("select s.id, p.name, s.depth, m1.value, m2.value from snapshots s " +
            "INNER JOIN projects p ON s.project_id = p.id " +
            "INNER JOIN project_measures m1 ON s.id = m1.snapshot_id " +
            "INNER JOIN project_measures m2 ON s.id = m2.snapshot_id " +
            "WHERE s.parent_snapshot_id = :snapshotId AND s.scope = :scope AND m1.metric_id = :metricId1 AND m2.metric_id = :metricId2");
      query.setParameter("snapshotId", snapshotId);
      query.setParameter("scope", scope);
      query.setParameter("metricId1", metric1);
      query.setParameter("metricId2", metric2);

      List<Object[]> result = query.getResultList();
      for (Object[] resultElement : result) {
        Integer id = (Integer) resultElement[0];
        String name = (String) resultElement[1];
        Integer depth = (Integer) resultElement[2];
        BigDecimal metric1Value = (BigDecimal) resultElement[3];
        BigDecimal metric2Value = (BigDecimal) resultElement[4];
        
        snapshots.add(new SonarSnapshotJpa(id, name, depth, metric1Value.doubleValue(), metric2Value.doubleValue()));
      }

      return snapshots;
    } catch (PersistenceException e) {
      LOGGER.error(e.getMessage(), e);
      snapshots = null;
    } finally {
      session.stop();
    }

    return snapshots;
  }

  public Metric getMetricById(Integer id) {
    Metric metric;

    try {
      session.start();
      Query query = session
          .createQuery("select m from Metric m where m.id = :id");
      query.setParameter("id", id);

      metric = (Metric) query.getSingleResult();
    } catch (PersistenceException e) {
      LOGGER.error(e.getMessage(), e);
      metric = null;
    } finally {
      session.stop();
    }

    return metric;
  }
}
