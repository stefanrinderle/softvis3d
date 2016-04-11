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
package de.rinderle.softvis3d.dao;

import de.rinderle.softvis3d.base.domain.MinMaxValue;
import de.rinderle.softvis3d.dao.dto.MetricResultDTO;
import de.rinderle.softvis3d.dao.scm.ScmCalculationService;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.sonar.ScmInfoType;
import de.rinderle.softvis3d.domain.sonar.SonarMeasure;
import java.util.ArrayList;
import java.util.List;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.Spy;
import org.sonarqube.ws.WsComponents;
import org.sonarqube.ws.WsMeasures;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.anyListOf;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.when;

/**
 * Created by stefan on 12.07.15.
 */
public class DaoServiceTest {

  @Mock
  private SonarDao sonarDao;
  @Mock
  private ScmCalculationService scmCalculationService;

  @InjectMocks
  @Spy
  private DaoService daoService;

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
  }

  @Test
  public void testGetMinMaxMetricValuesByRootSnapshotId() throws Exception {
    final String snapshotId = "12";
    final String metricId = "12";

    final MinMaxValue expectedMinMaxValue = new MinMaxValue(1.0, 20.0);
    when(sonarDao.getMinMaxMetricValuesByRootSnapshotId(eq(snapshotId), eq(metricId))).thenReturn(expectedMinMaxValue);

    final MinMaxValue minMaxValue = daoService.getMinMaxMetricValuesByRootSnapshotId(snapshotId, metricId);

    assertEquals(expectedMinMaxValue, minMaxValue);
  }

  @Test
  public void testGetDirectModuleChildrenIds() throws Exception {
    final String projectId = "12";

    final List<WsComponents.Component> moduleList = new ArrayList<>();
    when(sonarDao.getDirectModuleChildrenIds(null, eq(projectId))).thenReturn(moduleList);

    final List<SonarMeasure> result = daoService.getSubprojects(null, projectId);

    assertEquals(moduleList, result);
  }

  @Test
  @Ignore
  public void testGetFlatChildrenWithMetricsEmpty() throws Exception {
    final String projectId = "12";
    final VisualizationRequest requestDTO = new VisualizationRequest(projectId, "1", "20", ScmInfoType.NONE);

    List<WsMeasures.Component> snapshots = new ArrayList<>();

    when(sonarDao.getAllSnapshotIdsWithRescourceId(null, eq(projectId), anyListOf(String.class))).thenReturn(snapshots);

    final List<SonarMeasure> result = daoService.getFlatChildrenWithMetrics(null, requestDTO);
    assertEquals(0, result.size());
  }

  @Test
  @Ignore
  public void testGetFlatChildrenWithMetrics() throws Exception {
    final String snapshotId = "12";
    final VisualizationRequest requestDTO = new VisualizationRequest(snapshotId, "1", "20", ScmInfoType.NONE);

    final MetricResultDTO<Integer> metricResultDTO = new MetricResultDTO<Integer>(1, 20);
    List<WsMeasures.Component> snapshots = new ArrayList<>();
//    snapshots.add(metricResultDTO);
    when(sonarDao.getAllSnapshotIdsWithRescourceId(null, eq(snapshotId), anyListOf(String.class))).thenReturn(snapshots);

    final List<SonarMeasure> result = daoService.getFlatChildrenWithMetrics(null, requestDTO);
    assertEquals(1, result.size());
  }

//  @Test
//  @Ignore
//  public void testGetMaxScmInfo() throws Exception {
//    final VisualizationRequest requestDTO = new VisualizationRequest("12", "1", "20", ScmInfoType.NONE);
//
//    final Integer authorMetricId = 14;
////    when(sonarDao.getMetricIdByKey(any(LocalConnector.class), eq(DaoService.SCM_AUTHOR_NAME))).thenReturn(authorMetricId);
//    final List<MetricResultDTO<String>> metricResults = new ArrayList<MetricResultDTO<String>>();
//    final MetricResultDTO<String> metricResultDTO = new MetricResultDTO<String>(1, "stefan@inderle.info");
//    metricResults.add(metricResultDTO);
//    when(sonarDao.getMetricTextForAllProjectElementsWithMetric(eq(requestDTO.getRootSnapshotKey()), eq(authorMetricId))).thenReturn(metricResults);
//
//    when(daoService.getCalculationService(ScmInfoType.AUTHOR_COUNT)).thenReturn(scmCalculationService);
//
//    final int expectedResult = 4;
//    when(scmCalculationService.getNodeValue(anyString(), anyString())).thenReturn(expectedResult);
//
//    final MinMaxValue result = daoService.getMaxScmInfo(null, requestDTO);
//
//    assertEquals(new MinMaxValue(0, 4), result);
//  }
}
