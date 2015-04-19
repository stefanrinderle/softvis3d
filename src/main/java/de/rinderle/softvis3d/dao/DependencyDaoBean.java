/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.dao;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.Query;

import org.sonar.api.database.DatabaseSession;
import org.sonar.api.design.DependencyDto;
import com.google.inject.Singleton;
import de.rinderle.softvis3d.domain.sonar.SonarDependency;
import de.rinderle.softvis3d.domain.sonar.SonarDependencyBuilder;

/**
 * Use singleton to set the database session once on startup and to be sure that it is set on any other injection.
 */
@Singleton
public class DependencyDaoBean implements DependencyDao {

    private DatabaseSession session;

    @Override
    public void setDatabaseSession(final DatabaseSession session) {
        this.session = session;
    }

    @Override
    public List<SonarDependency> getDependencies(final Integer projectSnapshotId) {
        final String sqlQuery =
            "SELECT d.id, d.fromSnapshotId, d.toSnapshotId FROM " + DependencyDto.class.getSimpleName() + " d "
                + "WHERE d.projectSnapshotId = :projectSnapshotId AND fromScope = 'FIL' AND toScope = 'FIL' ";

        final Query query = this.session.createQuery(sqlQuery);

        query.setParameter("projectSnapshotId", projectSnapshotId);

        final List<Object[]> queryResult = (List<Object[]>) query.getResultList();

        return this.castToSonarDependency(queryResult);
    }

    private List<SonarDependency> castToSonarDependency(final List<Object[]> queryResult) {
        final List<SonarDependency> result = new ArrayList<SonarDependency>(queryResult.size());

        for (final Object[] object : queryResult) {
            final SonarDependencyBuilder dependency = new SonarDependencyBuilder();
            dependency.withId((Long) object[0]);
            dependency.withFromSnapshotId((Integer) object[1]);
            dependency.withToSnapshotId((Integer) object[2]);

            result.add(dependency.createSonarDependency());
        }

        return result;
    }

}
