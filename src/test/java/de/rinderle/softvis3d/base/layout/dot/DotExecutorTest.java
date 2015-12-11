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
package de.rinderle.softvis3d.base.layout.dot;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import att.grappa.Graph;
import de.rinderle.softvis3d.base.domain.LayoutViewType;

public class DotExecutorTest {

  private final static GraphvizPath PATH = new GraphvizPath("/usr/local/bin/dot", true);

  @InjectMocks
  private final DotExecutor underTest = new DotExecutor();
  @Mock
  private DotVersion dotVersion;
  @Mock
  private ExecuteCommand executeCommand;

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
    Mockito.when(this.dotVersion.getVersion(Mockito.any(GraphvizPath.class))).thenReturn(new Version("2.36.0"));

    Mockito.when(
      this.executeCommand.executeCommandReadAdot(Mockito.any(String.class), Mockito.any(String.class),
        Mockito.any(Version.class))).thenReturn(this.createADot());

    final Graph inputGraph = new Graph("not used in test");
    final Graph result = this.underTest.run(inputGraph, PATH, LayoutViewType.CITY);

    assertNotNull(result);
    assertTrue("777".equals(result.getName()));
  }

  @Test
  public void testHappyDependency() throws DotExecutorException {
    Mockito.when(this.dotVersion.getVersion(Mockito.any(GraphvizPath.class))).thenReturn(new Version("2.36.0"));

    Mockito.when(
      this.executeCommand.executeCommandReadAdot(Mockito.any(String.class), Mockito.any(String.class),
        Mockito.any(Version.class))).thenReturn(this.createADot());

    final Graph inputGraph = new Graph("not used in test");
    final Graph result = this.underTest.run(inputGraph, PATH, LayoutViewType.DEPENDENCY);

    assertNotNull(result);
    assertTrue("777".equals(result.getName()));
  }

  @Test
  public void testVersionFalse() throws DotExecutorException {
    Mockito.when(this.dotVersion.getVersion(Mockito.any(GraphvizPath.class))).thenReturn(new Version("2.36.0"));

    Mockito.when(
      this.executeCommand.executeCommandReadAdot(Mockito.any(String.class), Mockito.any(String.class),
        Mockito.any(Version.class))).thenReturn(this.createADot());

    final Graph inputGraph = new Graph("not used in test");
    this.underTest.run(inputGraph, PATH, LayoutViewType.CITY);

    Mockito.verify(this.executeCommand, Mockito.times(1)).executeCommandReadAdot(Mockito.any(String.class), Mockito.any(
        String.class), Mockito.any(Version.class));
  }

  @Test
  public void testVersionTrue() throws DotExecutorException {
    Mockito.when(this.dotVersion.getVersion(Mockito.any(GraphvizPath.class))).thenReturn(DotExecutor.DOT_BUG_VERSION);

    Mockito.when(
      this.executeCommand.executeCommandReadAdot(Mockito.any(String.class), Mockito.any(String.class),
        Mockito.any(Version.class))).thenReturn(this.createADot());

    final Graph inputGraph = new Graph("not used in test");
    this.underTest.run(inputGraph, PATH, LayoutViewType.CITY);

    Mockito.verify(this.executeCommand, Mockito.times(2)).executeCommandReadAdot(Mockito.any(String.class), Mockito.any(
        String.class), Mockito.any(Version.class));
  }

  @Test(expected = DotExecutorException.class)
  public void testExceptionOnVersion() throws DotExecutorException {
    Mockito.when(this.dotVersion.getVersion(Mockito.any(GraphvizPath.class))).thenThrow(DotExecutorException.class);

    final Graph inputGraph = new Graph("not used in test");
    this.underTest.run(inputGraph, PATH, LayoutViewType.CITY);
  }

  @Test(expected = DotExecutorException.class)
  public void testExceptionOnAdot() throws DotExecutorException {
    Mockito.when(this.dotVersion.getVersion(Mockito.any(GraphvizPath.class))).thenReturn(DotExecutor.DOT_BUG_VERSION);

    Mockito.when(this.executeCommand.executeCommandReadAdot(Mockito.any(String.class), Mockito.any(String.class),
        Mockito.any(Version.class))).thenThrow(DotExecutorException.class);

    final Graph inputGraph = new Graph("not used in test");
    this.underTest.run(inputGraph, PATH, LayoutViewType.CITY);
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

  @Test
  public void testNormalizeDotBinUnix() {
    final String source = "/usr/bin/dot";

    final String result = this.underTest.normalizeFilePath(source, false);

    assertEquals(source, result);
  }

  @Test
  public void testNormalizeDotBinWindows() {
    final String source = "C:\\Program Files (x86)\\graphviz\\bin";

    final String result = this.underTest.normalizeFilePath(source, true);

    assertEquals("\"" + "C:/Program Files (x86)/graphviz/bin" + "\"", result);
  }

  @Test
  public void testGetBasePathWindowsNormalized() {
    final String result = this.underTest.normalizeFilePath("D:/x_sri/graphviz/bin/dot", true);

    assertEquals("\"D:/x_sri/graphviz/bin/dot\"", result);
  }

}
