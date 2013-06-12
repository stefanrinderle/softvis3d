package de.rinderle.softviz3d;

import org.sonar.api.web.NavigationSection;

import org.sonar.api.web.AbstractRubyTemplate;
import org.sonar.api.web.RubyRailsPage;

@NavigationSection({ NavigationSection.RESOURCE })
public class SoftViz3dPage extends AbstractRubyTemplate implements
    RubyRailsPage {

  /**
   * @return the page id
   */
  public String getId() {
    return SoftViz3dPlugin.PLUGIN_KEY;
  }

  /**
   * @return the page title
   */
  public String getTitle() {
    return SoftViz3dPlugin.PLUGIN_NAME;
  }

  /**
   * {@inheritDoc}
   */
  @Override
  protected String getTemplatePath() {
    return "/softviz_page.html.erb";
  }
  
}
