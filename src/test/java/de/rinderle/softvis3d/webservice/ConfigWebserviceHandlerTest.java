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
package de.rinderle.softvis3d.webservice;

import de.rinderle.softvis3d.base.domain.Metric;
import de.rinderle.softvis3d.dao.DaoService;
import de.rinderle.softvis3d.webservice.config.ConfigWebserviceHandler;
import java.io.StringWriter;
import java.util.ArrayList;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.sonar.api.config.Settings;
import org.sonar.api.database.DatabaseSession;
import org.sonar.api.server.ws.Request;
import org.sonar.api.server.ws.Response;
import org.sonar.api.server.ws.WebService;
import org.sonar.api.utils.text.JsonWriter;
import org.sonar.api.utils.text.XmlWriter;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.when;

public class ConfigWebserviceHandlerTest {

  private final StringWriter stringWriter = new StringWriter();
  private final JsonWriter jsonWriter = JsonWriter.of(this.stringWriter);

  private final Integer snapshotId = 123;

  @InjectMocks
  private final ConfigWebserviceHandler handler = new ConfigWebserviceHandler();
  @Mock
  private DaoService daoService;
  @Mock
  private DatabaseSession session;

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);

    this.handler.setDatabaseSession(session);
    final Settings settings = new Settings();
    settings.setProperty("cacheEnabled", false);
    this.handler.setSettings(settings);
  }

  @Test
  @Ignore
  public void testConfigHandler() throws Exception {
    final Request request = this.createRequest();
    final Response response = this.createResponse();

    when(daoService.getMetric1FromSettings(any(Settings.class))).thenReturn(1);
    when(daoService.getMetric2FromSettings(any(Settings.class))).thenReturn(2);
    when(daoService.getDefinedMetricsForSnapshot(eq(snapshotId))).thenReturn(new ArrayList<Metric>());
    when(daoService.hasDependencies(eq(snapshotId))).thenReturn(false);

    this.handler.handle(request, response);

    // empty response because json transformer are mocked.
    assertEquals("{\"hasDependencies\":false,\"hasScmInfos\":false,\"settings\":{\"metric1\":1,\"metric2\":2},\"metricsForSnapshot\":[],\"scmMetricTypes\":[{\"name\":\"NONE\",\"description\":\"None\"},{\"name\":\"AUTHOR_COUNT\",\"description\":\"Author count\"},{\"name\":\"COMMIT_COUNT\",\"description\":\"Commit count\"}]}",
            this.stringWriter.toString());
  }

  private Request createRequest() {
    return new Request() {
      @Override
      public WebService.Action action() {
        return null;
      }

      @Override
      public String method() {
        return null;
      }

      @Override
      public String param(final String key) {
        if ("snapshotId".equals(key)) {
          return ConfigWebserviceHandlerTest.this.snapshotId.toString();
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
        return ConfigWebserviceHandlerTest.this.jsonWriter;
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
