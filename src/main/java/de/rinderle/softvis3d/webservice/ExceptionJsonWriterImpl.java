/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.webservice;

import org.sonar.api.server.ws.Response;
import org.sonar.api.utils.text.JsonWriter;

public class ExceptionJsonWriterImpl implements ExceptionJsonWriter {

    @Override
    public void transformExceptionToJson(final Response response, final Exception
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
