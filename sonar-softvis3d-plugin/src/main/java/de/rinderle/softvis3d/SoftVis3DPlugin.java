/**
 * SoftVis3D Sonar plugin
 * Copyright (C) 2016 Stefan Rinderle and Yvo Niedrich
 * stefan@rinderle.info / yvo.niedrich@gmail.com
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

import java.util.ArrayList;
import java.util.List;
import org.sonar.api.Extension;
import org.sonar.api.ExtensionPoint;
import org.sonar.api.SonarPlugin;

/**
 * This class is the entry point for all extensions.
 */
@ExtensionPoint
public final class SoftVis3DPlugin extends SonarPlugin {

  static final boolean IS_PROD = true;
  public static final boolean CACHE_ENABLED = true;

  @Override
  public List getExtensions() {
    final List extensions = new ArrayList<Extension>();

    extensions.add(SoftVis3DPage.class);
    extensions.add(SoftVis3DExtension.class);
    extensions.add(SoftVis3DWebservice.class);

    return extensions;
  }

}
