/*
 * SoftViz3d Sonar plugin
 * Copyright (C) 2013 Stefan Rinderle
 * dev@sonar.codehaus.org
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
package de.rinderle.softviz3d;

import org.sonar.api.Extension;
import org.sonar.api.SonarPlugin;

import java.util.ArrayList;
import java.util.List;

/**
 * This class is the entry point for all extensions
 */
public final class SoftViz3dPlugin extends SonarPlugin {

  // private static final Logger LOGGER = LoggerFactory.getLogger(SoftViz3dPlugin.class);

  public static final String PLUGIN_NAME = "Softviz3d Viewer";
  public static final String PLUGIN_KEY = "Softviz3d";

  public SoftViz3dPlugin() {
    super();
  }

  @Override
  public List<Class<? extends Extension>> getExtensions() {
    List<Class<? extends Extension>> extensions = new ArrayList<Class<? extends Extension>>();
    extensions.add(SoftViz3dPage.class);
    extensions.add(SoftViz3dExtension.class);
    return extensions;
  }

}
