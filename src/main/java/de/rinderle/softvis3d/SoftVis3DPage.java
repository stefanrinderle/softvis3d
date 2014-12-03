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
