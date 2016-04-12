package de.rinderle.softvis3d.dao;

import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.sonar.ColorMetricType;
import de.rinderle.softvis3d.domain.sonar.SonarMeasure;
import java.util.ArrayList;
import java.util.List;
import org.junit.Test;
import org.sonarqube.ws.WsComponents;
import org.sonarqube.ws.WsMeasures;

import static org.junit.Assert.assertEquals;

public class DaoServiceTransformerTest {

  private DaoServiceTransformer daoServiceTransformer = new DaoServiceTransformer();

  @Test
  public void testTransformComponentToModules() throws Exception {
    final List<WsComponents.Component> inputList = new ArrayList<>();

    final String expectedId = "123";
    final String expectedName = "456";
    final String expectedPath = "789";
    final WsComponents.Component.Builder wsComponent = WsComponents.Component.newBuilder()
        .setId(expectedId)
        .setName(expectedName)
        .setPath(expectedPath);

    inputList.add(wsComponent.build());

    final List<SonarMeasure> result = daoServiceTransformer.transformComponentToModules(inputList);

    assertEquals(1, result.size());
    assertEquals(expectedId, result.get(0).getId());
    assertEquals(expectedName, result.get(0).getName());
    assertEquals(expectedPath, result.get(0).getPath());
  }

  @Test
  public void testTransformComponentToMeasure() throws Exception {
    final List<WsMeasures.Component> inputList = new ArrayList<>();

    final String expectedId = "123";
    final String expectedName = "456";
    final String expectedPath = "789";

    final WsMeasures.Measure.Builder measure1 = WsMeasures.Measure.newBuilder()
        .setMetric("20")
        .setValue("1.1");
    final WsMeasures.Measure.Builder measure2 = WsMeasures.Measure.newBuilder()
        .setMetric("1")
        .setValue("2.2");

    final WsMeasures.Component.Builder wsComponent = WsMeasures.Component.newBuilder()
        .setId(expectedId)
        .setName(expectedName)
        .setPath(expectedPath)
        .addMeasures(0, measure1)
        .addMeasures(1, measure2);

    inputList.add(wsComponent.build());

    final VisualizationRequest requestDTO = new VisualizationRequest(expectedId, "1", "20", ColorMetricType.NONE);

    final List<SonarMeasure> result = daoServiceTransformer.transformComponentToMeasure(inputList, requestDTO);

    assertEquals(1, result.size());
    assertEquals(expectedId, result.get(0).getId());
    assertEquals(expectedName, result.get(0).getName());
    assertEquals(expectedPath, result.get(0).getPath());
    assertEquals(2.2, result.get(0).getFootprintMetricValue(), 0.0);
    assertEquals(1.1, result.get(0).getHeightMetricValue(), 0.0);
  }
}