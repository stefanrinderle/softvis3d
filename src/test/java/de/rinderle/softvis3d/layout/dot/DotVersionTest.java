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
package de.rinderle.softvis3d.layout.dot;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

public class DotVersionTest {

  @InjectMocks
  private final DotVersion underTest = new DotVersion();
  @Mock
  private ExecuteCommand executeCommand;

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
  }

  @Test
  public void testHappy() throws DotExecutorException {
    final String versionString = "2.20.2";
    final Version version = new Version(versionString);
    final String versionInfo = "dot - Graphviz version " + versionString + " (Tue Jan 14 19:38:44 UTC 2014)";
    Mockito.when(this.executeCommand.executeCommandReadErrorStream(Mockito.any(String.class))).thenReturn(
      versionInfo);

    final Version result = this.underTest.getVersion("dotBin");

    assertNotNull(result);

    System.out.println(result);
    assertTrue(version.equals(result));
  }

  @Test
  public void testVersion2() throws DotExecutorException {
    final String versionString = "2.0";
    final Version version = new Version(versionString);
    final String versionInfo = "dot version " + versionString + " (Mon Apr  6 14:19:01 UTC 2015)";
    Mockito.when(this.executeCommand.executeCommandReadErrorStream(Mockito.any(String.class))).thenReturn(
      versionInfo);

    final Version result = this.underTest.getVersion("dotBin");

    System.out.println(result);

    assertNotNull(result);
    assertTrue(version.equals(result));
  }

}
