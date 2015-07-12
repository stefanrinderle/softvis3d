package de.rinderle.softvis3d.domain.sonar;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

/**
 * Created by stefan on 12.07.15.
 */
public class SonarSnapshotBuilderTest {

  @Test
  public void test() {
    int id = 1;
    double footprint = 12.34;
    double height = 23.45;
    String path = "/path/to/file";
    int authorCount = 234;
    SonarSnapshotBuilder builder = new SonarSnapshotBuilder(id)
      .withFootprintMeasure(footprint)
      .withHeightMeasure(height)
      .withPath(path)
      .differentAuthors(authorCount);

    SonarSnapshot result = builder.build();

    assertEquals(id, result.getId());
    assertEquals(height, result.getHeightMetricValue(), 0.0);
    assertEquals(footprint, result.getFootprintMetricValue(), 0.0);
    assertEquals(path, result.getPath());
    assertEquals(authorCount, result.getAuthorCount());
  }

}
