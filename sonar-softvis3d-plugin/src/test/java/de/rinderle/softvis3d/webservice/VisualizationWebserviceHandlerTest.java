/**
 * SoftVis3D Sonar plugin
 * Copyright (C) 2016 Stefan Rinderle and Yvo Niedrich
 * stefan@rinderle.info / yvo.niedrich@gmail.com
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

import de.rinderle.softvis3d.base.domain.tree.RootTreeNode;
import de.rinderle.softvis3d.base.domain.tree.TreeNodeType;
import de.rinderle.softvis3d.base.domain.tree.ValueTreeNode;
import de.rinderle.softvis3d.base.result.SoftVis3dJsonWriter;
import de.rinderle.softvis3d.base.result.TreeNodeJsonWriter;
import de.rinderle.softvis3d.dao.DaoService;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.sonar.ColorMetricType;
import de.rinderle.softvis3d.preprocessing.PreProcessor;

import java.io.BufferedOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Collection;
import java.util.Collections;

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

@Ignore
public class VisualizationWebserviceHandlerTest {

  final StringOutputStream stringOutputStream = new StringOutputStream();

  private final String snapshotKey = "123";
  private final String footprintMetricKey = "1";
  private final String heightMetricKey = "21";
  private final ColorMetricType scmMetricType = ColorMetricType.AUTHOR_COUNT;

  @InjectMocks
  private VisualizationWebserviceHandler handler;
  @Mock
  private TreeNodeJsonWriter treeNodeJsonWriter;
  @Mock
  private PreProcessor preProcessor;
  @Mock
  private JsonWriter jsonWriterTest;

  @Mock
  private DaoService daoService;

  @Mock
  private LocalConnector localConnector;

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
  }

  @Test
  public void testVisualizationHandler() throws Exception {
    final Request request = this.createRequest();
    final Response response = this.createResponse();

    final RootTreeNode treeResult = mockPreProcessing();

    when(daoService.getProjectId(eq(localConnector), eq(this.snapshotKey))).thenReturn("projectId");

    this.handler.handle(request, response);

    // empty response because json transformer are mocked.
    assertEquals("{}", this.stringOutputStream.toString());

    verify(treeNodeJsonWriter, times(1)).transformRootTreeToJson(any(SoftVis3dJsonWriter.class), eq(treeResult));
  }

  private RootTreeNode mockPreProcessing() {
    final RootTreeNode rootTreeNode = new RootTreeNode("1");
    rootTreeNode.getChildren().put("2", new ValueTreeNode("2", rootTreeNode, 1, TreeNodeType.TREE, "2",
        Collections.emptyMap()));
    rootTreeNode.getChildren().put("3", new ValueTreeNode("3", rootTreeNode, 1, TreeNodeType.TREE, "3",
        Collections.emptyMap()));

    when(preProcessor.process(any(LocalConnector.class), any(VisualizationRequest.class))).thenReturn(rootTreeNode);

    return rootTreeNode;
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
      public LocalConnector localConnector() {
        return localConnector;
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
        return new Stream() {
          @Override
          public Stream setMediaType(String s) {
            return null;
          }

          @Override
          public Stream setStatus(int httpStatus) {
            return null;
          }

          @Override
          public OutputStream output() {
            return new BufferedOutputStream(stringOutputStream);
          }
        };
      }
    };
  }

  private class StringOutputStream extends OutputStream {

    private final StringBuilder string = new StringBuilder();

    @Override
    public void write(final int b) throws IOException {
      this.string.append((char) b);
    }

    @Override
    public String toString() {
      return this.string.toString();
    }
  }

}
