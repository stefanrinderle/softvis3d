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
package de.rinderle.softvis3d.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import org.sonar.api.resources.Qualifiers;
import org.sonar.api.server.ws.LocalConnector;
import org.sonarqube.ws.WsComponents;
import org.sonarqube.ws.WsMeasures;
import org.sonarqube.ws.client.WsClient;
import org.sonarqube.ws.client.WsClientFactories;
import org.sonarqube.ws.client.component.ShowWsRequest;
import org.sonarqube.ws.client.component.TreeWsRequest;
import org.sonarqube.ws.client.measure.ComponentTreeWsRequest;

class SonarDao {

  private static final int PAGE_SIZE = 500;

  String getProjectId(LocalConnector localConnector, String projectKey) {
    final WsClient wsClient = getWsClient(localConnector);

    final ShowWsRequest showComponentRequest = new ShowWsRequest();
    showComponentRequest.setKey(projectKey);

    final WsComponents.Component component = wsClient.components().show(showComponentRequest).getComponent();
    return component.getId();
  }

  List<WsComponents.Component> getDirectModuleChildrenIds(LocalConnector localConnector, final String projectId) {
    final WsClient wsClient = getWsClient(localConnector);

    final TreeWsRequest treeWsRequest = new TreeWsRequest();
    treeWsRequest.setBaseComponentId(projectId);
    final ArrayList<String> qualifiers = new ArrayList<>();
    qualifiers.add(Qualifiers.MODULE);
    treeWsRequest.setQualifiers(qualifiers);

    treeWsRequest.setPageSize(PAGE_SIZE);

    return wsClient.components().tree(treeWsRequest).getComponentsList();
  }

  List<WsMeasures.Component> getAllSnapshotIdsWithRescourceId(
      final LocalConnector localConnector, final String projectId, Set<String> metrics) {
    final List<WsMeasures.Component> result = new ArrayList<>();

    final WsClient wsClient = getWsClient(localConnector);

    int pageNumber = 1;
    WsMeasures.ComponentTreeWsResponse wsResult = this.getChildrenByBaseProjectId(wsClient, projectId, metrics, pageNumber);
    result.addAll(wsResult.getComponentsList());

    while (wsResult.getPaging().getPageIndex() * wsResult.getPaging().getPageSize() < wsResult.getPaging().getTotal()) {
      pageNumber++;
      wsResult = this.getChildrenByBaseProjectId(wsClient, projectId, metrics, pageNumber);
      result.addAll(wsResult.getComponentsList());
    }

    return result;
  }

  private WsMeasures.ComponentTreeWsResponse getChildrenByBaseProjectId(final WsClient wsClient,
    final String projectId, Set<String> metrics, final int page) {

    final ComponentTreeWsRequest request = new ComponentTreeWsRequest();
    request.setBaseComponentId(projectId);

    final List<String> metricList = new ArrayList<>();
    metricList.addAll(metrics);
    request.setMetricKeys(metricList);

    final List<String> qualifiers = new ArrayList<>();
    qualifiers.add(Qualifiers.FILE);
    request.setQualifiers(qualifiers);

    request.setPageSize(PAGE_SIZE);
    request.setPage(page);

    return wsClient.measures().componentTree(request);
  }

  private WsClient getWsClient(LocalConnector localConnector) {
    return WsClientFactories.getLocal().newClient(localConnector);
  }

}
