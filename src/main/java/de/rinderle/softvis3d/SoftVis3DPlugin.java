/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d;

import de.rinderle.softvis3d.domain.SoftVis3DConstants;
import org.sonar.api.*;

import java.util.ArrayList;
import java.util.List;

/**
 * This class is the entry point for all extensions.
 */
@Properties({
  @Property(key = SoftVis3DConstants.DOT_BIN_KEY, defaultValue = SoftVis3DConstants.DOT_BIN_DEFAULT,
    name = SoftVis3DConstants.DOT_BIN_NAME, description = SoftVis3DConstants.DOT_BIN_DESCRIPTION),
  @Property(key = "metric1", defaultValue = "complexity", type = PropertyType.METRIC,
    name = "Metric type 1", description = "This metric will be used for the building footprint"),
  @Property(key = "metric2", defaultValue = "lines", type = PropertyType.METRIC,
    name = "Metric type 2", description = "This metric will be used for the building height")
})
public final class SoftVis3DPlugin extends SonarPlugin {

  public final static boolean IS_PROD = false;

  public SoftVis3DPlugin() {
    super();
  }

  @Override
  public List<Class<? extends Extension>> getExtensions() {
    final List<Class<? extends Extension>> extensions = new ArrayList<Class<? extends Extension>>();

    extensions.add(SoftVis3DPage.class);
    extensions.add(SoftVis3DExtension.class);
    extensions.add(SoftVis3DWebservice.class);

    return extensions;
  }

}
