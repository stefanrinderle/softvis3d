package de.rinderle.softvis3d.domain.sonar;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class ColorMetricTypeTest {

  @Test
  public void testColorMetricTypeNone() {
    final ColorMetricType result = ColorMetricType.getColorMetricType(ColorMetricType.NONE.name());

    assertEquals(ColorMetricType.NONE.name(), result.getDefaultMetricName());
    assertNull(result.getScmCalculationService());
  }

  @Test
  public void testColorMetricTypeAuthorCount() {
    final ColorMetricType result = ColorMetricType.getColorMetricType(ColorMetricType.AUTHOR_COUNT.name());

    assertEquals(ColorMetricType.AUTHOR_COUNT.name(), result.getDefaultMetricName());
  }

  @Test
  public void testColorMetricTypeCommitCount() {
    final ColorMetricType result = ColorMetricType.getColorMetricType(ColorMetricType.COMMIT_COUNT.name());

    assertEquals(ColorMetricType.COMMIT_COUNT.name(), result.getDefaultMetricName());
  }

  @Test
  public void testColorMetricTypeDefault() {
    final String metricName = "ncloc";
    final ColorMetricType result = ColorMetricType.getColorMetricType(metricName);

    assertNull(result.getScmCalculationService());
    final String check = result.getDefaultMetricName();
    assertEquals(metricName, check);
  }

}