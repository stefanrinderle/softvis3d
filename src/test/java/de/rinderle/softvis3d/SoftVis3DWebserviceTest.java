/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d;

import org.junit.Test;
import org.sonar.api.config.Settings;
import org.sonar.api.database.DatabaseSession;
import org.sonar.api.server.ws.WebService;
import org.sonar.api.server.ws.WsTester;

import static org.fest.assertions.Assertions.assertThat;

public class SoftVis3DWebserviceTest {

    private DatabaseSession session;
    private Settings settings;
    private WebService ws = new SoftVis3DWebservice(this.session, this.settings);

    @Test
    public void shouldDefineSoftVis3DWebservice() throws Exception {
        // WsTester is available in the Maven artifact
        // org.codehaus.sonar:sonar-plugin-api
        // with type "test-jar"
        final WsTester tester = new WsTester(this.ws);
        final WebService.Controller controller = tester.controller("api/softVis3D");

        assertThat(controller).isNotNull();
        assertThat(controller.path()).isEqualTo("api/softVis3D");
        assertThat(controller.description()).isNotEmpty();
        assertThat(controller.actions()).hasSize(2);

//        final WebService.Action getTree = controller.action("getVisualization");
//        assertThat(getTree).isNotNull();
//        assertThat(getTree.key()).isEqualTo("getTree");
    }
}
