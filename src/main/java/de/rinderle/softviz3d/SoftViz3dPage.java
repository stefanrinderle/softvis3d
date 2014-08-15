/*
 * SoftViz3d Sonar plugin
 * Copyright (C) 2013 Stefan Rinderle
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
package de.rinderle.softviz3d;

import de.rinderle.softviz3d.layout.interfaces.SoftViz3dConstants;

import org.sonar.api.web.AbstractRubyTemplate;
import org.sonar.api.web.NavigationSection;
import org.sonar.api.web.RubyRailsPage;

@NavigationSection({NavigationSection.RESOURCE})
public class SoftViz3dPage extends AbstractRubyTemplate implements
    RubyRailsPage {

  /**
   * @return the page id
   */
  @Override
  public String getId() {
    return SoftViz3dConstants.PLUGIN_KEY;
  }

  /**
   * @return the page title
   */
  @Override
  public String getTitle() {
    return SoftViz3dConstants.PLUGIN_NAME;
  }

  /**
   * {@inheritDoc}
   */
  @Override
  protected String getTemplatePath() {
     return "/softviz_page.html.erb";
    
    // development mode
//    return "/Users/stefan/Documents/workspace_new/softvizSonarPlugin/src/main/resources/softviz_page.html.erb";
  }

}
