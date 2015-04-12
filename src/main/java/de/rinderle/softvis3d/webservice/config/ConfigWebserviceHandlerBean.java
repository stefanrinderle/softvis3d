/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.webservice.config;

import com.google.inject.Inject;
import de.rinderle.softvis3d.dao.DaoService;
import de.rinderle.softvis3d.domain.Metric;
import de.rinderle.softvis3d.webservice.AbstractWebserviceHandler;
import de.rinderle.softvis3d.webservice.ExceptionJsonWriter;
import de.rinderle.softvis3d.webservice.tree.TreeNodeJsonWriter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonar.api.config.Settings;
import org.sonar.api.server.ws.Request;
import org.sonar.api.server.ws.Response;
import org.sonar.api.utils.text.JsonWriter;

import java.util.List;
import javax.naming.OperationNotSupportedException;

public class ConfigWebserviceHandlerBean extends AbstractWebserviceHandler implements ConfigWebserviceHandler {

    private static final Logger LOGGER = LoggerFactory.getLogger(ConfigWebserviceHandlerBean.class);

    @Inject
    private DaoService daoService;
    private Settings settings;

    @Override
    public void setSettings(final Settings settings) {
        this.settings = settings;
    }

    @Override
    public void handleRequest(final Request request, final Response response) throws Exception {
        final Integer id = Integer.valueOf(request.param("snapshotId"));

        LOGGER.info("ConfigWebserviceHandler " + id);

        final Integer metric1 = this.daoService.getMetric1FromSettings(this.settings);
        final Integer metric2 = this.daoService.getMetric2FromSettings(this.settings);

        final List<Metric> metrics = this.daoService.getDefinedMetricsForSnapshot(id);

        final boolean hasDependencies = this.daoService.hasDependencies(id);

        final JsonWriter jsonWriter = response.newJsonWriter();
        jsonWriter.beginObject();
        jsonWriter.prop("hasDependencies", hasDependencies);
        this.transformMetricSettings(jsonWriter, metric1, metric2);
        this.transformMetrics(jsonWriter, metrics);
        jsonWriter.endObject();
        jsonWriter.close();
    }

    private void transformMetricSettings(JsonWriter jsonWriter, Integer metric1, Integer metric2) {
        jsonWriter.name("settings");
        jsonWriter.beginObject();
        jsonWriter.prop("metric1", metric1);
        jsonWriter.prop("metric2", metric2);
        jsonWriter.endObject();
    }

    private void transformMetrics(JsonWriter jsonWriter, List<Metric> metrics) {
        jsonWriter.name("metricsForSnapshot");
        jsonWriter.beginArray();

        for (Metric metric : metrics) {
            jsonWriter.beginObject();
            jsonWriter.prop("id", metric.getId());
            jsonWriter.prop("name", metric.getDescription());
            jsonWriter.endObject();
        }

        jsonWriter.endArray();
    }

}
