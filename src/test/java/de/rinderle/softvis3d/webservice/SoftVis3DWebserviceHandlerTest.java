/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.webservice;

import de.rinderle.softvis3d.cache.SnapshotCacheService;
import de.rinderle.softvis3d.dao.DaoService;
import de.rinderle.softvis3d.domain.LayoutViewType;
import de.rinderle.softvis3d.domain.SnapshotStorageKey;
import de.rinderle.softvis3d.domain.SnapshotTreeResult;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.tree.RootTreeNode;
import de.rinderle.softvis3d.webservice.tree.TreeNodeJsonWriter;
import de.rinderle.softvis3d.webservice.tree.TreeWebserviceHandler;
import de.rinderle.softvis3d.webservice.tree.TreeWebserviceHandlerBean;
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

import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;

public class SoftVis3DWebserviceHandlerTest {

	private final StringWriter stringWriter = new StringWriter();
	private final JsonWriter jsonWriter = JsonWriter.of(this.stringWriter);

	private final Integer snapshotId = 123;
	private final Integer footprintMetricId = 1;
	private final Integer heightMetricId = 21;
	private final String viewType = "city";

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

	@Test
	public void testHandler() throws Exception {
		final Request request = this.createRequest();
		final Response response = this.createResponse();

		final VisualizationRequest requestDTO = new VisualizationRequest(
				this.snapshotId, LayoutViewType.CITY, this.footprintMetricId,
				this.heightMetricId);

		final SnapshotStorageKey key = new SnapshotStorageKey(requestDTO);
		final RootTreeNode rootTreeNode = new RootTreeNode(1);
		final SnapshotTreeResult result = new SnapshotTreeResult(key,
				rootTreeNode);

		when(this.snapshotCacheService.getSnapshotTreeResult(any(SnapshotStorageKey.class)))
				.thenReturn(result);

		this.handler.handle(request, response);
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
			public String param(final String key) {
				if ("snapshotId".equals(key)) {
					return SoftVis3DWebserviceHandlerTest.this.snapshotId
							.toString();
				} else if ("footprintMetricId".equals(key)) {
					return SoftVis3DWebserviceHandlerTest.this.footprintMetricId
							.toString();
				} else if ("heightMetricId".equals(key)) {
					return SoftVis3DWebserviceHandlerTest.this.heightMetricId
							.toString();
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
