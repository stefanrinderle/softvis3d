/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.layout.dot;

import att.grappa.Graph;
import de.rinderle.softvis3d.domain.LayoutViewType;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.sonar.api.config.Settings;

import static org.junit.Assert.*;

public class DotExecutorTest {

  private final static Settings SETTINGS = new Settings();

  @Mock
  private DotVersion dotVersion;

  @Mock
  private ExecuteCommand executeCommand;

  @InjectMocks
  private final DotExecutorImpl underTest = new DotExecutorImpl();

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
  }

  @Test
  public void testString() {
    final String dotBin = "/usr/local/bin/dot";

    final int lastIndex = dotBin.lastIndexOf('/');
    final String result = dotBin.substring(0, lastIndex + 1);

    assertEquals("/usr/local/bin/", result);
  }

  @Test
  public void testHappy() throws DotExecutorException {
    Mockito.when(this.dotVersion.getVersion(Mockito.anyString()))
      .thenReturn("2.36.0");

    Mockito.when(
      this.executeCommand.executeCommandReadAdot(Mockito.any(String.class),
        Mockito.any(String.class))).thenReturn(this.createADot());

    final Graph inputGraph = new Graph("not used in test");
    final Graph result = this.underTest.run(inputGraph, SETTINGS, LayoutViewType.CITY);

    assertNotNull(result);
    assertTrue("777".equals(result.getName()));
  }

  @Test
  public void testHappyDependency() throws DotExecutorException {
    Mockito.when(this.dotVersion.getVersion(Mockito.anyString()))
      .thenReturn("2.36.0");

    Mockito.when(
      this.executeCommand.executeCommandReadAdot(Mockito.any(String.class),
        Mockito.any(String.class))).thenReturn(this.createADot());

    final Graph inputGraph = new Graph("not used in test");
    final Graph result = this.underTest.run(inputGraph, SETTINGS, LayoutViewType.DEPENDENCY);

    assertNotNull(result);
    assertTrue("777".equals(result.getName()));
  }

  @Test
  public void testVersionFalse() throws DotExecutorException {
    Mockito.when(this.dotVersion.getVersion(Mockito.anyString()))
      .thenReturn("2.36.0");

    Mockito.when(
      this.executeCommand.executeCommandReadAdot(Mockito.any(String.class),
        Mockito.any(String.class))).thenReturn(this.createADot());

    final Graph inputGraph = new Graph("not used in test");
    this.underTest.run(inputGraph, SETTINGS, LayoutViewType.CITY);

    Mockito.verify(this.executeCommand, Mockito.times(1)).executeCommandReadAdot(
      Mockito.any(String.class), Mockito.any(String.class));
  }

  @Test
  public void testVersionTrue() throws DotExecutorException {
    SETTINGS.setProperty("dotBinDirectory", "/usr/local/bin/dot");

    Mockito.when(this.dotVersion.getVersion(Mockito.anyString()))
      .thenReturn(DotExecutorImpl.DOT_BUG_VERSION);

    Mockito.when(
      this.executeCommand.executeCommandReadAdot(Mockito.any(String.class),
        Mockito.any(String.class))).thenReturn(this.createADot());

    final Graph inputGraph = new Graph("not used in test");
    this.underTest.run(inputGraph, SETTINGS, LayoutViewType.CITY);

    Mockito.verify(this.executeCommand, Mockito.times(2)).executeCommandReadAdot(
      Mockito.any(String.class), Mockito.any(String.class));
  }

  public String createADot() {
    final StringBuilder builder = new StringBuilder();
    builder.append("digraph 777 {");
    builder.append("\n");
    builder.append("graph [bb=\"0,0,612,600\"];");
    builder.append("\n");
    builder.append("subgraph 786 {");
    builder.append("\n");
    builder.append("843 [height=\"0.75\",");
    builder.append("\n");
    builder.append("metric1=\"29.0\",");
    builder.append("\n");
    builder.append("metric2=\"4.0\",");
    builder.append("\n");
    builder.append("pos=\"33,378\",");
    builder.append("\n");
    builder.append("width=\"0.75\"");
    builder.append("];");
    builder.append("\n");
    builder.append("}");
    builder.append("\n");
    builder.append("}");

    return builder.toString();
  }
}
