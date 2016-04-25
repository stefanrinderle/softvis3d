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

import org.sonar.api.server.ws.Response;
import org.sonar.api.utils.text.JsonWriter;

class ExceptionJsonWriter {

  void transformExceptionToJson(final Response response, final Exception
      exception) {
    response.stream().setStatus(500);

    final JsonWriter jsonWriter = response.newJsonWriter();
    jsonWriter.beginObject();

    jsonWriter.name("errors");
    jsonWriter.beginArray();

    jsonWriter.beginObject();
    jsonWriter.prop("msg", exception.getMessage());
    jsonWriter.endObject();

    jsonWriter.endArray();

    jsonWriter.endObject();

    jsonWriter.close();
  }

}
