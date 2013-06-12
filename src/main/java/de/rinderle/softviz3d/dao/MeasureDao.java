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

import javax.persistence.PersistenceException;
import javax.persistence.Query;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.database.DatabaseSession;
import org.sonar.api.database.model.MeasureModel;

public class MeasureDao {

	private static final Logger LOGGER = LoggerFactory
			.getLogger(MeasureDao.class);

	private DatabaseSession session;

	public MeasureDao(DatabaseSession session) {
		super();
		this.session = session;
	}

	/**
	 * Retrieves the measure data of the given measure model id.
	 * 
	 * @param id
	 * @return the measure data or null if no data are saved for the given id
	 */
	public Double getMeasureDataById(Integer snapshotId, Integer metricId) {

	    Double data;
	    try {
	      session.start();
	      Query query = session
	          .createQuery("select m from MeasureModel m where m.snapshotId = ? AND m.metricId = ?");
	      query.setParameter(1, snapshotId);
	      query.setParameter(2, metricId);
	
	      MeasureModel measure = (MeasureModel) query.getSingleResult();
	      data = measure.getValue();
	    } catch (PersistenceException e) {
	      LOGGER.error(e.getMessage(), e);
	      data = null;
	    } finally {
	      session.stop();
	    }

    return data;
  }
}
