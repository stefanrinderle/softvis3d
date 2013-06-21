package de.rinderle.softviz3d.sonar;

import org.sonar.api.measures.Metric;

import org.sonar.api.database.model.MeasureModel;

import de.rinderle.softviz3d.SoftViz3dExtension;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.database.DatabaseSession;
import org.sonar.api.database.model.Snapshot;

import javax.persistence.PersistenceException;
import javax.persistence.Query;

import java.math.BigDecimal;
import java.util.List;

public class SonarDao {

  private static final Logger LOGGER = LoggerFactory
      .getLogger(SoftViz3dExtension.class);

  private DatabaseSession session;

  public SonarDao(DatabaseSession session) {
    this.session = session;
  }

  public Snapshot getSnapshotById(Integer id) {
    Snapshot snapshot;

    try {
      session.start();
      Query query = session
          .createQuery("select s from Snapshot s where s.id = :id");
      query.setParameter("id", id);

      snapshot = (Snapshot) query.getSingleResult();
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
  
  public List<Snapshot> getChildrenByScope(Integer snapshotId, String scope) {
    List<Snapshot> snapshots;

    try {
      session.start();
      Query query = session
          .createQuery("select s from Snapshot s where s.parentId = :id and s.scope = :scope");
      query.setParameter("id", snapshotId);
      query.setParameter("scope", scope);

      snapshots = (List<Snapshot>) query.getResultList();
    } catch (PersistenceException e) {
      LOGGER.error(e.getMessage(), e);
      snapshots = null;
    } finally {
      session.stop();
    }

    return snapshots;
  }
  
  public Double getMetricValue(Integer snapshotId, Integer metricId) {
    BigDecimal value;

    try {
      session.start();
      Query query = session
          .createNativeQuery("SELECT m.value FROM snapshots s " +
            "INNER JOIN project_measures m ON s.id = m.snapshot_id " +
            "WHERE m.metric_id = :metricId AND s.id = :snapshotId");
      query.setParameter("metricId", metricId);
      query.setParameter("snapshotId", snapshotId);

      value = (BigDecimal) query.getSingleResult();
    } catch (PersistenceException e) {
      LOGGER.error(e.getMessage(), e);
      //TODO SRI
      value = new BigDecimal(1);
    } finally {
      session.stop();
    }

    return value.doubleValue();
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
