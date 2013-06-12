package de.rinderle.softviz3d;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.Extension;
import org.sonar.api.SonarPlugin;


/**
 * This class is the entry point for all extensions
 */
public final class SoftViz3dPlugin extends SonarPlugin {

	private static final Logger LOGGER = LoggerFactory.getLogger(SoftViz3dPlugin.class);

	public static final String PLUGIN_NAME = "Softviz3d Viewer";
	public static final String PLUGIN_KEY = "Softviz3d";
	  
	public SoftViz3dPlugin() {
		super();
		LOGGER.info("SoftViz3d Plugin successfully created.");
	}

	public List<Class<? extends Extension>> getExtensions() {
		List<Class<? extends Extension>> extensions = new ArrayList<Class<? extends Extension>>();
		extensions.add(SoftViz3dPage.class);
		extensions.add(SoftViz3dExtension.class);
		return extensions;
	}

}
