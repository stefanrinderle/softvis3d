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
import org.sonar.api.web.AbstractRubyTemplate;
import org.sonar.api.web.NavigationSection;
import org.sonar.api.web.RubyRailsPage;

@NavigationSection({NavigationSection.RESOURCE})
public class SoftVis3DPage extends AbstractRubyTemplate implements
  RubyRailsPage {

  /**
   * @return the page id
   */
  @Override
  public String getId() {
    return SoftVis3DConstants.PLUGIN_KEY;
  }

  /**
   * @return the page title
   */
  @Override
  public String getTitle() {
    return SoftVis3DConstants.PLUGIN_NAME;
  }

  /**
   * {@inheritDoc}
   */
  @Override
  protected String getTemplatePath() {

    if (SoftVis3DPlugin.IS_PROD) {
      return "/softVis3D_page.html.erb";
    } else {
      return "/Users/stefan/Documents/workspace_new/softvizSonarPlugin/src/main/resources/softVis3D_page.html.erb";
    }
  }

}
