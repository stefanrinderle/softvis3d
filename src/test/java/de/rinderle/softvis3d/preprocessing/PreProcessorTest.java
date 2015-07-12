package de.rinderle.softvis3d.preprocessing;

import de.rinderle.softvis3d.cache.SnapshotCacheService;
import de.rinderle.softvis3d.dao.DaoService;
import de.rinderle.softvis3d.domain.LayoutViewType;
import de.rinderle.softvis3d.domain.SnapshotStorageKey;
import de.rinderle.softvis3d.domain.SnapshotTreeResult;
import de.rinderle.softvis3d.domain.VisualizationRequest;
import de.rinderle.softvis3d.preprocessing.dependencies.DependencyExpander;
import de.rinderle.softvis3d.preprocessing.tree.OptimizeTreeStructure;
import de.rinderle.softvis3d.preprocessing.tree.TreeBuilder;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.when;

/**
 * Created by stefan on 12.07.15.
 */
public class PreProcessorTest {

  @Mock
  private TreeBuilder treeBuilder;
  @Mock
  private OptimizeTreeStructure optimizeTreeStructure;
  @Mock
  private SnapshotCacheService snapshotCacheService;
  @Mock
  private DaoService daoService;
  @Mock
  private DependencyExpander dependencyExpander;

  @InjectMocks
  private PreProcessor preProcessor;

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
  }

  @Test
  public void testProcessCached() throws Exception {
    VisualizationRequest requestDTO = new VisualizationRequest(1, LayoutViewType.CITY, 1, 20);
    final SnapshotStorageKey mapKey = new SnapshotStorageKey(requestDTO);

    when(snapshotCacheService.containsKey(eq(mapKey))).thenReturn(true);
    SnapshotTreeResult expectedResult = new SnapshotTreeResult(mapKey, null);
    when(snapshotCacheService.getSnapshotTreeResult(eq(mapKey))).thenReturn(expectedResult);
    expectedResult = snapshotCacheService.getSnapshotTreeResult(mapKey);

    SnapshotTreeResult result = preProcessor.process(requestDTO);

    assertEquals(expectedResult, result);
  }

  @Test
  public void testProcessNotCachedCity() throws Exception {
    VisualizationRequest requestDTO = new VisualizationRequest(1, LayoutViewType.CITY, 1, 20);
    final SnapshotStorageKey mapKey = new SnapshotStorageKey(requestDTO);

    when(snapshotCacheService.containsKey(eq(mapKey))).thenReturn(false);
    SnapshotTreeResult result = preProcessor.process(requestDTO);

    assertEquals(mapKey, result.getStorageKey());
  }

  @Test
  public void testProcessNotCachedDependency() throws Exception {
    VisualizationRequest requestDTO = new VisualizationRequest(1, LayoutViewType.DEPENDENCY, 1, 20);
    final SnapshotStorageKey mapKey = new SnapshotStorageKey(requestDTO);

    when(snapshotCacheService.containsKey(eq(mapKey))).thenReturn(false);
    SnapshotTreeResult result = preProcessor.process(requestDTO);

    assertEquals(mapKey, result.getStorageKey());
  }
}
