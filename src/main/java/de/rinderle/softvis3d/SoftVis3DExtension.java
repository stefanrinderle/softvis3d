/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d;

import com.google.inject.Guice;
import com.google.inject.Injector;
import de.rinderle.softvis3d.dao.DaoService;
import de.rinderle.softvis3d.dao.SonarDao;
import de.rinderle.softvis3d.guice.SoftVis3DModule;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.ServerExtension;
import org.sonar.api.config.Settings;
import org.sonar.api.database.DatabaseSession;

import java.util.List;

public class SoftVis3DExtension implements ServerExtension {

	private static final Logger LOGGER = LoggerFactory
			.getLogger(SoftVis3DExtension.class);

	private final Settings settings;
	private final DaoService daoService;
	private final Injector softVis3DInjector;

	public SoftVis3DExtension(final DatabaseSession session,
			final Settings settings) {
		LOGGER.warn("Constructor SoftVis3DExtension");
		this.settings = settings;

		this.softVis3DInjector = Guice.createInjector(new SoftVis3DModule());

		final SonarDao sonarDao = this.softVis3DInjector
				.getInstance(SonarDao.class);
		sonarDao.setDatabaseSession(session);

		this.daoService = this.softVis3DInjector.getInstance(DaoService.class);
	}

	public boolean isProd() {
		return SoftVis3DPlugin.IS_PROD;
	}

	public List<Integer> getMetricsForSnapshot(final Integer snapshotId) {
		LOGGER.info("getMetricsForSnapshot " + snapshotId);

		return this.daoService.getDefinedMetricsForSnapshot(snapshotId);
	}

	public Integer getMetric1FromSettings() {
		return this.daoService.getMetric1FromSettings(this.settings);
	}

	public Integer getMetric2FromSettings() {
		return this.daoService.getMetric2FromSettings(this.settings);
	}

}
