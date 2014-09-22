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

import de.rinderle.softviz3d.sonar.SonarService;
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

import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.anyInt;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.when;

/**
 * Created by stefan on 22.09.14.
 */
public class SoftViz3dWebserviceHandlerTest {

    private StringWriter stringWriter = new StringWriter();
    private JsonWriter jsonWriter = JsonWriter.of(stringWriter);

    private Integer snapshotId = 123;

    @Mock
    private SonarService sonarService;

    @InjectMocks
    private SoftViz3dWebserviceHandler handler = new SoftViz3dWebserviceHandlerImpl();

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testHandler() throws Exception {
        Request request = createRequest();
        Response response = createResponse();

        String serviceResult = "service result";
        when(sonarService.getSnapshotDetails(eq(snapshotId), anyInt(), anyInt(), anyInt())).thenReturn(serviceResult);

        handler.handle(request, response);

        assertTrue(stringWriter.toString().contains(serviceResult));
    }

    private Request createRequest() {
        return new Request() {
                @Override
                public WebService.Action action() {
                    return null;
                }

                @Override
                public String method() {
                    return "getSnapshotDetails";
                }

                @Override
                public String param(String key) {
                    if ("snapshotId".equals(key)) {
                        return snapshotId.toString();
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
