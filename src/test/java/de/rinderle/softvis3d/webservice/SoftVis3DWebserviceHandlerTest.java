/*
 * SoftVis3D Sonar plugin
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
package de.rinderle.softvis3d.webservice;

import de.rinderle.softvis3d.cache.SnapshotCacheService;
import de.rinderle.softvis3d.dao.DaoService;
import org.junit.Before;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.sonar.api.server.ws.Request;
import org.sonar.api.server.ws.Response;
import org.sonar.api.server.ws.WebService;
import org.sonar.api.utils.text.JsonWriter;
import org.sonar.api.utils.text.XmlWriter;

import java.io.StringWriter;

public class SoftVis3DWebserviceHandlerTest {

  private final StringWriter stringWriter = new StringWriter();
  private final JsonWriter jsonWriter = JsonWriter.of(this.stringWriter);

  private final Integer snapshotId = 123;
  private final Integer footprintMetricId = 1;
  private final Integer heightMetricId = 21;
  private final String viewType = "city";

  private final static String MAP_KEY = "1";

  @Mock
  private DaoService daoService;
  @Mock
  private SnapshotCacheService snapshotCacheService;
  @Mock
  private TreeNodeJsonWriter treeNodeJsonWriter;

  @InjectMocks
  private final TreeWebserviceHandler handler = new TreeWebserviceHandlerBean();

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
  }

  // @Test
  // public void testHandler() throws Exception {
  // final Request request = this.createRequest();
  // final Response response = this.createResponse();
  //
  // final VisualizationRequestDTO requestDTO = new VisualizationRequestDTO(this.snapshotId, LayoutViewType.CITY,
  // this.footprintMetricId, this.heightMetricId);
  //
  // when(this.resourceTreeService.getOrCreateTreeStructure(requestDTO)).thenReturn(MAP_KEY);
  //
  // this.handler.handle(request, response);
  //
  // // TODO: assert response stream
  // }

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
      public String param(final String key) {
        if ("snapshotId".equals(key)) {
          return SoftVis3DWebserviceHandlerTest.this.snapshotId.toString();
        } else if ("footprintMetricId".equals(key)) {
          return SoftVis3DWebserviceHandlerTest.this.footprintMetricId.toString();
        } else if ("heightMetricId".equals(key)) {
          return SoftVis3DWebserviceHandlerTest.this.heightMetricId.toString();
        } else if ("viewType".equals(key)) {
          return SoftVis3DWebserviceHandlerTest.this.viewType;
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
        return SoftVis3DWebserviceHandlerTest.this.jsonWriter;
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
