/**
 * SoftVis3D Sonar plugin
 * Copyright (C) 2016 Stefan Rinderle
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

import java.io.OutputStream;
import java.io.StringWriter;
import java.util.Collection;
import org.junit.Test;
import org.sonar.api.server.ws.Response;
import org.sonar.api.utils.text.JsonWriter;
import org.sonar.api.utils.text.XmlWriter;

import static org.junit.Assert.assertEquals;

/**
 * Created by stefan on 12.07.15.
 */
public class ExceptionJsonWriterTest {

  private final StringWriter stringWriter = new StringWriter();
  private final JsonWriter jsonWriter = JsonWriter.of(this.stringWriter);

  @Test
  public void testTransformExceptionToJson() throws Exception {

    final ExceptionJsonWriter underTest = new ExceptionJsonWriter();

    final Exception exception = new IllegalArgumentException("message");

    underTest.transformExceptionToJson(createResponse(), exception);

    final String expectedString = "{\"errors\":[{\"msg\":\"message\"}]}";
    assertEquals(expectedString, stringWriter.toString());
  }

  private Response createResponse() {
    return new Response() {
      @Override
      public JsonWriter newJsonWriter() {
        return ExceptionJsonWriterTest.this.jsonWriter;
      }

      @Override
      public XmlWriter newXmlWriter() {
        return null;
      }

      @Override
      public Response noContent() {
        return null;
      }

      public Response setHeader(String name, String value) {
        return null;
      }

      public Collection<String> getHeaderNames() {
        return null;
      }

      public String getHeader(String name) {
        return null;
      }

      @Override
      public Stream stream() {
        return new Stream() {
          @Override
          public Stream setMediaType(final String s) {
            return null;
          }

          @Override
          public Stream setStatus(final int httpStatus) {
            return this;
          }

          @Override
          public OutputStream output() {
            return null;
          }
        };
      }
    };
  }
}
