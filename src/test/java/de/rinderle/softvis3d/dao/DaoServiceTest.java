/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
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

import de.rinderle.softvis3d.dao.dto.MetricResultDTO;
import de.rinderle.softvis3d.domain.LayoutViewType;
import de.rinderle.softvis3d.domain.Metric;
import de.rinderle.softvis3d.domain.MinMaxValue;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.sonar.ModuleInfo;
import de.rinderle.softvis3d.domain.sonar.SonarDependency;
import de.rinderle.softvis3d.domain.sonar.SonarDependencyBuilder;
import de.rinderle.softvis3d.domain.sonar.SonarSnapshot;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.sonar.api.config.Settings;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.anyString;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.when;

/**
 * Created by stefan on 12.07.15.
 */
public class DaoServiceTest {

  @Mock
  private SonarDao sonarDao;
  @Mock
  private DependencyDao dependencyDao;
  @Mock
  private ScmCalculationService scmCalculationService;

  @InjectMocks
  private DaoService daoService;

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
  }

  @Test
  public void testGetMetric1FromSettings() throws Exception {
    Settings settings = new Settings();
    String metricKey = "ncloc";
    Integer metricId = 12;
    settings.setProperty("metric1", metricKey);

    when(sonarDao.getMetricIdByKey(eq(metricKey))).thenReturn(metricId);

    Integer result = daoService.getMetric1FromSettings(settings);

    assertEquals(metricId, result);
  }

  @Test
  public void testGetMetric2FromSettings() throws Exception {
    Settings settings = new Settings();
    String metricKey = "ncloc";
    Integer metricId = 12;
    settings.setProperty("metric2", metricKey);

    when(sonarDao.getMetricIdByKey(eq(metricKey))).thenReturn(metricId);

    Integer result = daoService.getMetric2FromSettings(settings);

    assertEquals(metricId, result);
  }

  @Test
  public void testGetDefinedMetricsForSnapshot() throws Exception {
    int snapshotId = 12;

    List<Metric> expectedResult = new ArrayList<>();
    when(sonarDao.getDistinctMetricsBySnapshotId(eq(snapshotId))).thenReturn(expectedResult);

    List<Metric> result = daoService.getDefinedMetricsForSnapshot(snapshotId);

    assertEquals(expectedResult, result);
  }

  @Test
  public void testGetMinMaxMetricValuesByRootSnapshotId() throws Exception {
    int snapshotId = 12;
    int metricId = 12;

    MinMaxValue expectedMinMaxValue = new MinMaxValue(1.0, 20.0);
    when(sonarDao.getMinMaxMetricValuesByRootSnapshotId(eq(snapshotId), eq(metricId))).thenReturn(expectedMinMaxValue);

    MinMaxValue minMaxValue = daoService.getMinMaxMetricValuesByRootSnapshotId(snapshotId, metricId);

    assertEquals(expectedMinMaxValue, minMaxValue);
  }

  @Test
  public void testHasDependenciesFalse() throws Exception {
    int snapshotId = 12;

    when(sonarDao.getDirectModuleChildrenIds(eq(snapshotId))).thenReturn(Collections.<ModuleInfo>emptyList());
    when(dependencyDao.getDependencies(eq(snapshotId))).thenReturn(Collections.<SonarDependency>emptyList());

    assertFalse(daoService.hasDependencies(snapshotId));
  }

  @Test
  public void testHasDependenciesTrue() throws Exception {
    int snapshotId = 12;

    when(sonarDao.getDirectModuleChildrenIds(eq(snapshotId))).thenReturn(Collections.<ModuleInfo>emptyList());
    List<SonarDependency> dependencies = new ArrayList<>();
    SonarDependency dependency = new SonarDependencyBuilder().createSonarDependency();
    dependencies.add(dependency);
    when(dependencyDao.getDependencies(eq(snapshotId))).thenReturn(dependencies);

    assertTrue(daoService.hasDependencies(snapshotId));
  }

  @Test
  public void testGetDirectModuleChildrenIds() throws Exception {
    int snapshotId = 12;

    List<ModuleInfo> moduleList = new ArrayList<>();
    when(sonarDao.getDirectModuleChildrenIds(eq(snapshotId))).thenReturn(moduleList);

    List<ModuleInfo> result = daoService.getDirectModuleChildrenIds(snapshotId);

    assertEquals(moduleList, result);
  }

  @Test
  public void testGetDependencies() throws Exception {
    int snapshotId = 12;

    List<SonarDependency> dependencies = new ArrayList<>();
    SonarDependency dependency = new SonarDependencyBuilder().createSonarDependency();
    dependencies.add(dependency);
    when(dependencyDao.getDependencies(eq(snapshotId))).thenReturn(dependencies);

    List<SonarDependency> result = daoService.getDependencies(snapshotId);

    assertEquals(dependencies, result);
  }

  @Test
  public void testGetFlatChildrenWithMetricsEmpty() throws Exception {
    int snapshotId = 12;
    VisualizationRequest requestDTO = new VisualizationRequest(snapshotId, LayoutViewType.CITY, 1, 20);

    List<MetricResultDTO<Integer>> snapshots = new ArrayList<>();

    when(sonarDao.getAllSnapshotIdsWithRescourceId(eq(snapshotId))).thenReturn(snapshots);

    List<SonarSnapshot> result = daoService.getFlatChildrenWithMetrics(requestDTO);
    assertEquals(0, result.size());
  }

  @Test
  public void testGetFlatChildrenWithMetrics() throws Exception {
    int snapshotId = 12;
    VisualizationRequest requestDTO = new VisualizationRequest(snapshotId, LayoutViewType.CITY, 1, 20);

    List<MetricResultDTO<Integer>> snapshots = new ArrayList<>();
    MetricResultDTO<Integer> metricResultDTO = new MetricResultDTO<>(1, 20);
    snapshots.add(metricResultDTO);
    when(sonarDao.getAllSnapshotIdsWithRescourceId(eq(snapshotId))).thenReturn(snapshots);

    List<SonarSnapshot> result = daoService.getFlatChildrenWithMetrics(requestDTO);
    assertEquals(1, result.size());
  }

  @Test
  public void testGetMaxScmInfo() throws Exception {
    int snapshotId = 12;

    final Integer authorMetricId = 14;
    when(sonarDao.getMetricIdByKey(eq(DaoService.SCM_AUTHOR_NAME))).thenReturn(authorMetricId);
    List<MetricResultDTO<String>> metricResults = new ArrayList<>();
    MetricResultDTO<String> metricResultDTO = new MetricResultDTO<>(1, "stefan@inderle.info");
    metricResults.add(metricResultDTO);
    when(sonarDao.getMetricTextForAllProjectElementsWithMetric(eq(snapshotId), eq(authorMetricId))).thenReturn(metricResults);

    int expectedResult = 4;

    when(scmCalculationService.getDifferentAuthors(anyString(), anyString())).thenReturn(expectedResult);

    int result = daoService.getMaxScmInfo(snapshotId);

    assertEquals(expectedResult, result);
  }
}
