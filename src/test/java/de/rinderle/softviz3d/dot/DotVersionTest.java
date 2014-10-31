/*
 * SoftViz3d Sonar plugin
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
package de.rinderle.softviz3d.dot;

import de.rinderle.softviz3d.layout.dot.DotExcecutorException;
import de.rinderle.softviz3d.layout.dot.DotVersion;
import de.rinderle.softviz3d.layout.dot.DotVersionImpl;
import de.rinderle.softviz3d.layout.dot.ExecuteCommand;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.sonar.api.config.Settings;

import static junit.framework.TestCase.assertTrue;
import static org.junit.Assert.assertNotNull;

public class DotVersionTest {

  @Mock
  private ExecuteCommand executeCommand;

  @InjectMocks
  private DotVersion underTest = new DotVersionImpl();

  @Before
  public void setUp() {
    MockitoAnnotations.initMocks(this);
  }

  @Test
  public void testHappy() throws DotExcecutorException {
    final String version = "2.20.2";
    final String versionInfo = "dot - Graphviz version " + version + " (Tue Jan 14 19:38:44 UTC 2014)";
    Mockito.when(
      executeCommand.executeCommandReadErrorStream(Mockito.any(String.class))).thenReturn(versionInfo);

    final String result = underTest.getVersion(new Settings());

    assertNotNull(result);
    assertTrue(version.equals(result));
  }

}
