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

import org.sonar.api.web.page.Context;
import org.sonar.api.web.page.Page;
import org.sonar.api.web.page.PageDefinition;

import static org.sonar.api.web.page.Page.Scope.COMPONENT;

public class SoftVis3DPageDefinition implements PageDefinition {

  private static final String PLUGIN_KEY = "softvis3d";
  private static final String PLUGIN_NAME = "SoftVis3D Viewer";

  private static final String PLUGIN_OVERVIEW = "overview_page";

  @Override
  public void define(Context context) {
    context
        .addPage(Page.builder(PLUGIN_KEY + '/' + PLUGIN_OVERVIEW).setName(PLUGIN_NAME).setScope
            (COMPONENT).build());
  }
}
