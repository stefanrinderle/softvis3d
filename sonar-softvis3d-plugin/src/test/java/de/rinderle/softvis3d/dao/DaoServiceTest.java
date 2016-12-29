/**
 * SoftVis3D Sonar plugin
 * Copyright (C) 2016 Stefan Rinderle and Yvo Niedrich
 * stefan@rinderle.info / yvo.niedrich@gmail.com
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

import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.sonar.SonarMeasure;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.sonar.api.server.ws.LocalConnector;
import org.sonarqube.ws.WsComponents;
import org.sonarqube.ws.WsMeasures;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.when;

/**
 * Created by stefan on 12.07.15.
 */
public class DaoServiceTest {

  @Mock
  private SonarDao sonarDao;
  @Mock
  private DaoServiceTransformer daoServiceTransformer;
  @Mock
  private LocalConnector localConnector;

  @InjectMocks
  private DaoService daoService;

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
  }

  @Test
  public void testGetProjectId() throws Exception {
    final String projectKey = "12";
    final String expectedId = "sifsuisiudfhfdsuhk";

    when(sonarDao.getProjectId(eq(localConnector), eq(projectKey))).thenReturn(expectedId);

    final String result = daoService.getProjectId(localConnector, projectKey);

    assertEquals(expectedId, result);
  }

  @Test
  public void testGetDirectModuleChildrenIdsNoChildren() throws Exception {
    final String projectId = "12";

    final List<WsComponents.Component> moduleList = new ArrayList<>();
    when(sonarDao.getDirectModuleChildrenIds(eq(localConnector), eq(projectId))).thenReturn(moduleList);
    final List<SonarMeasure> resultProjects = new ArrayList<>();
    when(daoServiceTransformer.transformComponentToModules(eq(moduleList))).thenReturn(resultProjects);

    final List<SonarMeasure> result = daoService.getSubProjects(localConnector, projectId);

    assertEquals(resultProjects, result);
  }

  @Test
  public void testGetFlatChildrenWithMetrics() throws Exception {
    final String projectId = "12";
    final String[] metrics = {"ncolc", "complediy"};
    final VisualizationRequest requestDTO = new VisualizationRequest(projectId, metrics);

    final List<WsMeasures.Component> snapshots = new ArrayList<>();
    final Set<String> expectedMetricList = new HashSet<>();
    expectedMetricList.add("1");
    expectedMetricList.add("20");
    when(sonarDao.getAllSnapshotIdsWithRescourceId(eq(localConnector), eq(projectId), eq(metrics))).thenReturn(snapshots);

    final List<SonarMeasure> resultMeasures = new ArrayList<>();
    when(daoServiceTransformer.transformComponentToMeasure(eq(snapshots))).thenReturn(resultMeasures);

    final List<SonarMeasure> result = daoService.getFlatChildrenWithMetrics(localConnector, requestDTO);
    assertEquals(resultMeasures, result);
  }

}
