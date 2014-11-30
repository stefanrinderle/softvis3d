/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2013 Stefan Rinderle
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

import static junit.framework.TestCase.assertTrue;
import static org.junit.Assert.assertNotNull;

public class DotVersionTest {

  @Mock
  private ExecuteCommand executeCommand;

  @InjectMocks
  private final DotVersion underTest = new DotVersionImpl();

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
  }

  @Test
  public void testHappy() throws DotExecutorException {
    final String version = "2.20.2";
    final String versionInfo = "dot - Graphviz version " + version + " (Tue Jan 14 19:38:44 UTC 2014)";
    Mockito.when(
      this.executeCommand.executeCommandReadErrorStream(Mockito.any(String.class))).thenReturn(versionInfo);

    final String result = this.underTest.getVersion("dotBin");

    assertNotNull(result);
    assertTrue(version.equals(result));
  }

}
