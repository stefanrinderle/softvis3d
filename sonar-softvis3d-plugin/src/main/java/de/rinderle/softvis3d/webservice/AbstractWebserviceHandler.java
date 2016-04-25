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

import com.google.inject.Inject;
import de.rinderle.softvis3d.base.layout.dot.DotExecutorException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.server.ws.Request;
import org.sonar.api.server.ws.RequestHandler;
import org.sonar.api.server.ws.Response;

abstract class AbstractWebserviceHandler implements RequestHandler {

  private static final Logger LOGGER = LoggerFactory.getLogger(AbstractWebserviceHandler.class);

  @Inject
  private ExceptionJsonWriter exceptionJsonWriter;

  @Override
  public void handle(final Request request, final Response response) {
    try {
      this.handleRequest(request, response);
    } catch (final Exception exception) {
      LOGGER.error(exception.getMessage(), exception);
      exceptionJsonWriter.transformExceptionToJson(response, exception);
    }
  }

  public abstract void handleRequest(Request request, Response response) throws DotExecutorException;

}
