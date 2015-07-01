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

import de.rinderle.softvis3d.VisualizationProcessor;
import de.rinderle.softvis3d.cache.LayoutCacheService;
import de.rinderle.softvis3d.domain.LayoutViewType;
import de.rinderle.softvis3d.domain.SnapshotStorageKey;
import de.rinderle.softvis3d.domain.SnapshotTreeResult;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.graph.ResultPlatform;
import de.rinderle.softvis3d.domain.tree.RootTreeNode;
import de.rinderle.softvis3d.layout.dot.DotExecutorException;
import de.rinderle.softvis3d.preprocessing.PreProcessor;
import de.rinderle.softvis3d.webservice.visualization.TreeNodeJsonWriter;
import de.rinderle.softvis3d.webservice.visualization.VisualizationJsonWriter;
import de.rinderle.softvis3d.webservice.visualization.VisualizationWebserviceHandler;
import org.junit.Before;
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

import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class VisualizationWebserviceHandlerTest {

  private final StringWriter stringWriter = new StringWriter();
  private final JsonWriter jsonWriter = JsonWriter.of(this.stringWriter);

  private final Integer snapshotId = 123;
  private final Integer footprintMetricId = 1;
  private final Integer heightMetricId = 21;
  private final String viewType = "city";

  @InjectMocks
  private final VisualizationWebserviceHandler handler = new VisualizationWebserviceHandler();
  @Mock
  private TreeNodeJsonWriter treeNodeJsonWriter;
  @Mock
  private PreProcessor preProcessor;
  @Mock
  private VisualizationProcessor visualizationProcessor;
  @Mock
  private VisualizationJsonWriter visualizationJsonWriter;
  @Mock
  private LayoutCacheService layoutCacheService;
  @Mock
  private DatabaseSession session;

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);

    this.handler.setDatabaseSession(session);
    when(layoutCacheService.containsKey(any(SnapshotStorageKey.class))).thenReturn(false);
  }

  @Test
  public void testVisualizationHandler() throws Exception {
    final Request request = this.createRequest();
    final Response response = this.createResponse();

    final VisualizationRequest requestDTO = new VisualizationRequest(
      this.snapshotId, LayoutViewType.CITY, this.footprintMetricId, this.heightMetricId);

    final SnapshotTreeResult treeResult = mockPreProcessing(requestDTO);

    final Map<Integer, ResultPlatform> visualizationResult = mockVisualization(requestDTO, treeResult);

    this.handler.handle(request, response);

    // empty response because json transformer are mocked.
    assertEquals("{\"resultObject\":[]}", this.stringWriter.toString());

    verify(treeNodeJsonWriter, times(1)).transformTreeToJsonBla(eq(jsonWriter), eq(treeResult.getTree()));
    verify(visualizationJsonWriter, times(1)).transformResponseToJson(eq(jsonWriter), eq(visualizationResult));
  }

  private Map<Integer, ResultPlatform> mockVisualization(VisualizationRequest requestDTO, SnapshotTreeResult treeResult) throws DotExecutorException {
    final Map<Integer, ResultPlatform> visualizationResult = new HashMap<Integer, ResultPlatform>();
    when(visualizationProcessor.visualize(any(Settings.class), eq(requestDTO), eq(treeResult)))
      .thenReturn(visualizationResult);

    return visualizationResult;
  }

  private SnapshotTreeResult mockPreProcessing(VisualizationRequest requestDTO) {
    final SnapshotStorageKey key = new SnapshotStorageKey(requestDTO);
    final RootTreeNode rootTreeNode = new RootTreeNode(1);
    final SnapshotTreeResult treeResult = new SnapshotTreeResult(key, rootTreeNode);

    when(preProcessor.process(eq(requestDTO))).thenReturn(treeResult);

    return treeResult;
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
          return VisualizationWebserviceHandlerTest.this.snapshotId.toString();
        } else if ("footprintMetricId".equals(key)) {
          return VisualizationWebserviceHandlerTest.this.footprintMetricId.toString();
        } else if ("heightMetricId".equals(key)) {
          return VisualizationWebserviceHandlerTest.this.heightMetricId.toString();
        } else if ("viewType".equals(key)) {
          return VisualizationWebserviceHandlerTest.this.viewType;
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
        return VisualizationWebserviceHandlerTest.this.jsonWriter;
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
