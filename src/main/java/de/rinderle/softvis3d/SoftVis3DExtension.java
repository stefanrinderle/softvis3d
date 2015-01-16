/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.ServerExtension;

public class SoftVis3DExtension implements ServerExtension {

	private static final Logger LOGGER = LoggerFactory
			.getLogger(SoftVis3DExtension.class);

	public SoftVis3DExtension() {
		LOGGER.warn("Constructor SoftVis3DExtension");
	}

	public boolean isProd() {
		return SoftVis3DPlugin.IS_PROD;
	}

}
