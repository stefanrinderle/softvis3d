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
package de.rinderle.softviz3d.handler;

import de.rinderle.softviz3d.layout.calc.LayoutViewType;
import de.rinderle.softviz3d.sonar.SonarService;
import de.rinderle.softviz3d.tree.ResourceTreeService;
import de.rinderle.softviz3d.tree.TreeNode;
import de.rinderle.softviz3d.tree.TreeNodeType;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.sonar.api.server.ws.Request;
import org.sonar.api.server.ws.Response;
import org.sonar.api.server.ws.WebService;
import org.sonar.api.utils.text.JsonWriter;
import org.sonar.api.utils.text.XmlWriter;

import java.io.StringWriter;

import static org.mockito.Mockito.when;

/**
 * Created by stefan on 22.09.14.
 */
public class SoftViz3dWebserviceHandlerTest {

  private StringWriter stringWriter = new StringWriter();
  private JsonWriter jsonWriter = JsonWriter.of(stringWriter);

  private Integer snapshotId = 123;
  private Integer footprintMetricId = 1;
  private Integer heightMetricId = 21;
  private String viewType = "city";

  @Mock
  private SonarService sonarService;
  @Mock
  private ResourceTreeService resourceTreeService;

  @InjectMocks
  private SoftViz3dWebserviceInitializeHandler handler = new SoftViz3dWebserviceInitializeHandlerImpl();

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
  }

  @Test
  public void testHandler() throws Exception {
    Request request = createRequest();
    Response response = createResponse();

    TreeNode tree = new TreeNode(snapshotId, null, 0, TreeNodeType.TREE, snapshotId + "", 0, 0);
    when(resourceTreeService.createTreeStructure(LayoutViewType.CITY, snapshotId, footprintMetricId, heightMetricId)).thenReturn(tree);

    handler.handle(request, response);

    // TODO: assert response stream
  }

  private Request createRequest() {
    return new Request() {
      @Override
      public WebService.Action action() {
        return null;
      }

      @Override
      public String method() {
        return "initialize";
      }

      @Override
      public String param(String key) {
        if ("snapshotId".equals(key)) {
          return snapshotId.toString();
        } else if ("footprintMetricId".equals(key)) {
          return footprintMetricId.toString();
        } else if ("heightMetricId".equals(key)) {
          return heightMetricId.toString();
        } else if ("viewType".equals(key)) {
          return viewType;
        } else {
          return "";
        }
      }
    };
  }

  private Response createResponse() {
    return new Response() {
      @Override
      public JsonWriter newJsonWriter() {
        return jsonWriter;
      }

      @Override
      public XmlWriter newXmlWriter() {
        return null;
      }

      @Override
      public Response noContent() {
        return null;
      }

      @Override
      public Stream stream() {
        return null;
      }
    };
  }

}
