/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.webservice;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.server.ws.Request;
import org.sonar.api.server.ws.RequestHandler;
import org.sonar.api.server.ws.Response;
import com.google.inject.Inject;

public abstract class AbstractWebserviceHandler implements RequestHandler {

    private static final Logger LOGGER = LoggerFactory.getLogger(AbstractWebserviceHandler.class);

    @Inject
    private ExceptionJsonWriter exceptionJsonWriter;

    @Override
    public void handle(final Request request, final Response response) {
        try {
            this.handleRequest(request, response);
        } catch (final Exception exception) {
            exceptionJsonWriter.transformExceptionToJson(response, exception);
        }
    }

    public abstract void handleRequest(final Request request, final Response response) throws Exception;


}
