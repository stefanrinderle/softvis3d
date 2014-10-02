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

import javax.persistence.PersistenceException;
import javax.persistence.Query;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

@Singleton
public class DependencyDaoImpl implements DependencyDao {

    private static final Logger LOGGER = LoggerFactory
            .getLogger(DependencyDaoImpl.class);

    private DatabaseSession session;

    @Override
    public void setDatabaseSession(DatabaseSession session) {
        this.session = session;
    }

    @Override
    public List<SonarDependency> getDependencies(Integer projectSnapshotId) {
        List<SonarDependency> result = null;

        try {
            session.start();
            Query query = session
                .createNativeQuery("SELECT * FROM dependencies d WHERE project_snapshot_id = :projectSnapshotId");
            
            query.setParameter("projectSnapshotId", projectSnapshotId);

            List<Object[]> queryResult = (List<Object[]>) query.getResultList();

            LOGGER.info("DependencyDao result size = " + queryResult);

            result = castToSonarDependency(queryResult);

        } catch (PersistenceException e) {
            LOGGER.error(e.getMessage(), e);
        } finally {
            session.stop();
        }

        return result;
    }

    private List<SonarDependency> castToSonarDependency(final List<Object[]> queryResult) {
        List<SonarDependency> result = new ArrayList<SonarDependency>(queryResult.size());

        for(Object[] object : queryResult) {
            SonarDependency dependency = new SonarDependency();
            dependency.setId((BigInteger) object[0]);
            dependency.setFromSnapshotId((Integer) object[1]);
            dependency.setFromResouorceId((Integer) object[2]);
            dependency.setToSnapshotId((Integer) object[3]);
            dependency.setToResourceId((Integer) object[4]);

            result.add(dependency);
        }

        return result;
    }

}
