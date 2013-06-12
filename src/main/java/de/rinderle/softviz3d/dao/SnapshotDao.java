/*
 * Sonar, open source software quality management tool.
 * Copyright (C) 2009 SonarSource
 * mailto:contact AT sonarsource DOT com
 *
 * Sonar is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * Sonar is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with Sonar; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
 */

package de.rinderle.softviz3d.dao;

import java.util.List;

import javax.persistence.PersistenceException;
import javax.persistence.Query;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.database.DatabaseSession;
import org.sonar.api.database.model.Snapshot;

public class SnapshotDao {

	private static final Logger LOGGER = LoggerFactory
			.getLogger(SnapshotDao.class);

	private DatabaseSession session;

	public SnapshotDao(DatabaseSession session) {
		super();
		this.session = session;
	}

	/**
	 * Retrieves the measure data of the given measure model id.
	 * 
	 * @param id
	 * @return the measure data or null if no data are saved for the given id
	 */
	public Snapshot getSnapshotById(Integer id) {
		Snapshot snapshot;
		
		try {
			session.start();
			Query query = session
					.createQuery("select s from Snapshot s where s.id = ?");
			query.setParameter(1, id);

			snapshot = (Snapshot) query.getSingleResult();
		} catch (PersistenceException e) {
			LOGGER.error(e.getMessage(), e);
			snapshot = null;
		} finally {
			session.stop();
		}

		return snapshot;
	}

	@Deprecated
	@SuppressWarnings("unchecked")
	public List<Snapshot> getChildren(Integer id) {
		List<Snapshot> snapshots;
		
		try {
			session.start();
			Query query = session.createQuery("select s from Snapshot s where s.parentId = ?");
			query.setParameter(1, id);

			snapshots = (List<Snapshot>) query.getResultList();
		} catch (PersistenceException e) {
			LOGGER.error(e.getMessage(), e);
			snapshots = null;
		} finally {
			session.stop();
		}

		return snapshots;
	}

	/**
	 * @deprecated Please rewrite this to get all children sorted by scope.
	 */
	@Deprecated
	@SuppressWarnings("unchecked")
	public List<Snapshot> getChildrenByScope(Integer id, String scope) {
		List<Snapshot> snapshots;
		
		try {
			session.start();
			Query query = session.createQuery("select s from Snapshot s where s.parentId = ? and s.scope = ?");
			query.setParameter(1, id);
			query.setParameter(2, scope);
			
			snapshots = (List<Snapshot>) query.getResultList();
		} catch (PersistenceException e) {
			LOGGER.error(e.getMessage(), e);
			snapshots = null;
		} finally {
			session.stop();
		}

		return snapshots;
	}
}
