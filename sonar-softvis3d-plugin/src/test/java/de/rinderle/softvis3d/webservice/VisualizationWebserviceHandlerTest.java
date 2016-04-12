/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2015 Stefan Rinderle
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

import de.rinderle.softvis3d.base.VisualizationAdditionalInfos;
import de.rinderle.softvis3d.base.VisualizationProcessor;
import de.rinderle.softvis3d.base.VisualizationSettings;
import de.rinderle.softvis3d.base.domain.SnapshotTreeResult;
import de.rinderle.softvis3d.base.domain.graph.ResultPlatform;
import de.rinderle.softvis3d.base.domain.tree.RootTreeNode;
import de.rinderle.softvis3d.base.layout.dot.DotExecutorException;
import de.rinderle.softvis3d.base.layout.helper.StringOutputStream;
import de.rinderle.softvis3d.base.result.SoftVis3dJsonWriter;
import de.rinderle.softvis3d.base.result.TreeNodeJsonWriter;
import de.rinderle.softvis3d.base.result.VisualizationJsonWriter;
import de.rinderle.softvis3d.cache.LayoutCacheService;
import de.rinderle.softvis3d.dao.DaoService;
import de.rinderle.softvis3d.domain.SnapshotStorageKey;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.sonar.ScmInfoType;
import de.rinderle.softvis3d.preprocessing.PreProcessor;
import java.io.InputStream;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.sonar.api.server.ws.LocalConnector;
import org.sonar.api.server.ws.Request;
import org.sonar.api.server.ws.Response;
import org.sonar.api.utils.text.JsonWriter;
import org.sonar.api.utils.text.XmlWriter;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class VisualizationWebserviceHandlerTest {

  final StringOutputStream stringOutputStream = new StringOutputStream();
  final SoftVis3dJsonWriter jsonWriter = new SoftVis3dJsonWriter(stringOutputStream);

  private final String snapshotKey = "123";
  private final String footprintMetricKey = "1";
  private final String heightMetricKey = "21";
  private final String viewType = "city";
  private final ScmInfoType scmMetricType = ScmInfoType.AUTHOR_COUNT;

  @InjectMocks
  private VisualizationWebserviceHandler handler;
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
  private JsonWriter jsonWriterTest;

  @Mock
  private DaoService daoService;

  @Mock
  private LocalConnector localConnector;

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);

    when(layoutCacheService.containsKey(any(SnapshotStorageKey.class))).thenReturn(false);
  }

  @Test
  @Ignore
  public void testVisualizationHandler() throws Exception {
    final Request request = this.createRequest();
    final Response response = this.createResponse();

    final VisualizationRequest requestDTO = new VisualizationRequest(
      this.snapshotKey, this.footprintMetricKey, this.heightMetricKey, ScmInfoType.NONE);

    final SnapshotTreeResult treeResult = mockPreProcessing(requestDTO);
    final Map<String, ResultPlatform> visualizationResult = mockVisualization(requestDTO, treeResult);

    when(daoService.getProjectId(eq(localConnector), eq(this.snapshotKey))).thenReturn("projectId");

    this.handler.handle(request, response);

    // empty response because json transformer are mocked.
    assertEquals("{\"resultObject\":[]}", this.stringOutputStream.toString());

    verify(treeNodeJsonWriter, times(1)).transformRootTreeToJson(eq(jsonWriter), eq(treeResult.getTree()));
    verify(visualizationJsonWriter, times(1)).transformResponseToJson(eq(jsonWriter), eq(visualizationResult));
  }

  private Map<String, ResultPlatform> mockVisualization(final VisualizationRequest requestDTO, final SnapshotTreeResult treeResult) throws DotExecutorException {
    final Map<String, ResultPlatform> visualizationResult = new HashMap<>();
    when(visualizationProcessor.visualize(eq(requestDTO.getViewType()), any(VisualizationSettings.class), eq(treeResult), any(VisualizationAdditionalInfos.class)))
      .thenReturn(visualizationResult);

    return visualizationResult;
  }

  private SnapshotTreeResult mockPreProcessing(final VisualizationRequest requestDTO) {
    final RootTreeNode rootTreeNode = new RootTreeNode("1");
    final SnapshotTreeResult treeResult = new SnapshotTreeResult(rootTreeNode);

    when(preProcessor.process(eq(localConnector), any(VisualizationRequest.class))).thenReturn(treeResult);

    return treeResult;
  }

  private Request createRequest() {
    return new Request() {

      @Override
      public String method() {
        return null;
      }

      @Override
      public String getMediaType() {
        return null;
      }

      @Override
      public boolean hasParam(String key) {
        return false;
      }

      @Override
      public String param(final String key) {
        if ("projectKey".equals(key)) {
          return VisualizationWebserviceHandlerTest.this.snapshotKey;
        } else if ("footprintMetricKey".equals(key)) {
          return VisualizationWebserviceHandlerTest.this.footprintMetricKey;
        } else if ("heightMetricKey".equals(key)) {
          return VisualizationWebserviceHandlerTest.this.heightMetricKey;
        } else if ("colorMetricKey".equals(key)) {
          return VisualizationWebserviceHandlerTest.this.scmMetricType.name();
        } else {
          return "";
        }
      }

      @Override
      public InputStream paramAsInputStream(String key) {
        return null;
      }

      @Override
      public LocalConnector getLocalConnector() {
        return null;
      }
    };
  }

  private Response createResponse() {
    return new Response() {
      @Override
      public JsonWriter newJsonWriter() {
        return VisualizationWebserviceHandlerTest.this.jsonWriterTest;
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
      public Response setHeader(String name, String value) {
        return null;
      }

      @Override
      public Collection<String> getHeaderNames() {
        return null;
      }

      @Override
      public String getHeader(String name) {
        return null;
      }

      @Override
      public Stream stream() {
        return null;
      }
    };
  }

}
