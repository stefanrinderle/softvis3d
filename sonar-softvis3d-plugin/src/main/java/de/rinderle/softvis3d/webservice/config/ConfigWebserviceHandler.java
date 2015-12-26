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
package de.rinderle.softvis3d.webservice.config;

import com.google.inject.Inject;
import de.rinderle.softvis3d.base.domain.Metric;
import de.rinderle.softvis3d.dao.DaoService;
import de.rinderle.softvis3d.domain.sonar.ScmInfoType;
import de.rinderle.softvis3d.webservice.AbstractWebserviceHandler;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.config.Settings;
import org.sonar.api.database.DatabaseSession;
import org.sonar.api.server.ws.Request;
import org.sonar.api.server.ws.RequestHandler;
import org.sonar.api.server.ws.Response;
import org.sonar.api.utils.text.JsonWriter;

public class ConfigWebserviceHandler extends AbstractWebserviceHandler implements RequestHandler {

  private static final Logger LOGGER = LoggerFactory.getLogger(ConfigWebserviceHandler.class);

  @Inject
  private DaoService daoService;

  private Settings settings;
  private DatabaseSession session;

  public void setSettings(final Settings settings) {
    this.settings = settings;
  }

  public void setDatabaseSession(final DatabaseSession session) {
    this.session = session;
  }

  @Override
  public void handleRequest(final Request request, final Response response) throws Exception {
    this.session.start();

    final Integer id = Integer.valueOf(request.param("snapshotId"));

    LOGGER.info("ConfigWebserviceHandler " + id);

    final Integer metric1 = this.daoService.getMetric1FromSettings(this.settings);
    final Integer metric2 = this.daoService.getMetric2FromSettings(this.settings);

    final List<Metric> metrics = this.daoService.getDefinedMetricsForSnapshot(id);

    final boolean hasDependencies = this.daoService.hasDependencies(id);
    final boolean hasScmInfos = this.daoService.hasScmInfos(id);

    final JsonWriter jsonWriter = response.newJsonWriter();
    jsonWriter.beginObject();
    jsonWriter.prop("hasDependencies", hasDependencies);
    jsonWriter.prop("hasScmInfos", hasScmInfos);

    this.transformMetricSettings(jsonWriter, metric1, metric2);
    this.transformMetrics(jsonWriter, metrics);

    this.transformScmMetricTypes(jsonWriter);

    jsonWriter.endObject();
    jsonWriter.close();

    this.session.commit();
  }

  private void transformScmMetricTypes(final JsonWriter jsonWriter) {
    jsonWriter.name("scmMetricTypes");
    jsonWriter.beginArray();

    for (final ScmInfoType scmInfoType : ScmInfoType.values()) {
      jsonWriter.beginObject();
      jsonWriter.prop("name", scmInfoType.name());
      jsonWriter.prop("description", scmInfoType.getDescription());
      jsonWriter.endObject();
    }

    jsonWriter.endArray();
  }

  private void transformMetricSettings(final JsonWriter jsonWriter, final Integer metric1, final Integer metric2) {
    jsonWriter.name("settings");
    jsonWriter.beginObject();
    jsonWriter.prop("metric1", metric1);
    jsonWriter.prop("metric2", metric2);
    jsonWriter.endObject();
  }

  private void transformMetrics(final JsonWriter jsonWriter, final List<Metric> metrics) {
    jsonWriter.name("metricsForSnapshot");
    jsonWriter.beginArray();

    for (final Metric metric : metrics) {
      jsonWriter.beginObject();
      jsonWriter.prop("id", metric.getId());
      jsonWriter.prop("name", metric.getDescription());
      jsonWriter.endObject();
    }

    jsonWriter.endArray();
  }

}
