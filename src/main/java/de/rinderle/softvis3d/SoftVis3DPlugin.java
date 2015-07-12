/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
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
package de.rinderle.softvis3d;

import de.rinderle.softvis3d.domain.SoftVis3DConstants;
import org.sonar.api.Extension;
import org.sonar.api.Properties;
import org.sonar.api.Property;
import org.sonar.api.PropertyType;
import org.sonar.api.SonarPlugin;

import java.util.ArrayList;
import java.util.List;

/**
 * This class is the entry point for all extensions.
 */
@Properties({
  @Property(key = SoftVis3DConstants.DOT_BIN_KEY, defaultValue = SoftVis3DConstants.DOT_BIN_DEFAULT,
    name = SoftVis3DConstants.DOT_BIN_NAME, description = SoftVis3DConstants.DOT_BIN_DESCRIPTION),
  @Property(key = "metric1", defaultValue = "complexity", type = PropertyType.METRIC, name = "Metric type 1",
    description = "This metric will be used for the building footprint"),
  @Property(key = "metric2", defaultValue = "lines", type = PropertyType.METRIC, name = "Metric type 2",
    description = "This metric will be used for the building height")})
public final class SoftVis3DPlugin extends SonarPlugin {

  public static final boolean IS_PROD = false;
  public static final boolean CACHE_ENABLED = true;
  public static final boolean HAS_SCM_FEATURE = false;

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
