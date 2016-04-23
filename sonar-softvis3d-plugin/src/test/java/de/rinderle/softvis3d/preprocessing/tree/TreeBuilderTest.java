package de.rinderle.softvis3d.preprocessing.tree;

import de.rinderle.softvis3d.base.domain.tree.RootTreeNode;
import de.rinderle.softvis3d.dao.DaoService;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.domain.sonar.ColorMetricType;
import de.rinderle.softvis3d.domain.sonar.SonarMeasure;
import java.util.ArrayList;
import java.util.List;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.sonar.api.server.ws.LocalConnector;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.when;

/**
 * Created by stefanrinderle on 23.04.16.
 */
public class TreeBuilderTest {

  private final String snapshotKey = "123";
  private final String footprintMetricKey = "1";
  private final String heightMetricKey = "21";

  @InjectMocks
  private TreeBuilder underTest;

  @Mock
  private DaoService daoService;

  @Mock
  private LocalConnector localConnector;

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
  }

  @Test
  public void createTreeStructure() throws Exception {
    final VisualizationRequest requestDTO = new VisualizationRequest(
        this.snapshotKey, this.footprintMetricKey, this.heightMetricKey, ColorMetricType.NONE);

    RootTreeNode result = underTest.createTreeStructure(localConnector, requestDTO);

    assertEquals(0, result.getChildren().size());
    assertEquals(this.snapshotKey, result.getId());
  }

  @Test
  public void createTreeStructureWithChildren() throws Exception {
    final VisualizationRequest requestDTO = new VisualizationRequest(
        this.snapshotKey, this.footprintMetricKey, this.heightMetricKey, ColorMetricType.NONE);

    final List<SonarMeasure> measures = new ArrayList<>();
    measures.add(new SonarMeasure("2", "2", "/src/main/2", 3, 4, 5));
    when(this.daoService.getFlatChildrenWithMetrics(eq(localConnector), eq(requestDTO))).thenReturn(measures);

    final RootTreeNode result = underTest.createTreeStructure(localConnector, requestDTO);

    assertEquals(1, result.getChildren().size());
    assertEquals(1, result.getChildren().values().iterator().next().getDepth().intValue());
    assertEquals(this.snapshotKey, result.getId());
  }

  @Test
  public void createTreeStructureWithChildrenAndModules() throws Exception {
    final VisualizationRequest requestDTO = new VisualizationRequest(
        this.snapshotKey, this.footprintMetricKey, this.heightMetricKey, ColorMetricType.NONE);

    final List<SonarMeasure> modules = new ArrayList<>();
    modules.add(new SonarMeasure("1", "1", "module1", 3, 4, 5));
    modules.add(new SonarMeasure("2", "2", "module1", 3, 4, 5));
    when(this.daoService.getSubProjects(any(LocalConnector.class), any(String.class))).thenReturn(modules);

    final List<SonarMeasure> measures = new ArrayList<>();
    measures.add(new SonarMeasure("3", "3", "/src/main/2", 3, 4, 5));
    when(this.daoService.getFlatChildrenWithMetrics(any(LocalConnector.class), any(VisualizationRequest.class))).thenReturn(measures);

    final RootTreeNode result = underTest.createTreeStructure(localConnector, requestDTO);

    assertEquals(2, result.getChildren().size());
    assertEquals(1, result.getChildren().values().iterator().next().getDepth().intValue());
    assertEquals(this.snapshotKey, result.getId());
  }
}