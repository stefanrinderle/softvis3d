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
package de.rinderle.softvis3d.dao.scm;

import java.text.ParseException;
import org.junit.Test;

import static org.junit.Assert.assertSame;

public class ScmAuthorCountCalculationServiceTest {

  private final ScmCalculationService scmCalculationService = new ScmAuthorCountCalculationService();

  @Test
  public void testAuthorCountFirstExample() throws ParseException {
    final int differentUsers = scmCalculationService.getNodeValue(ScmTestDataHelper.getFirstExample(), ScmTestDataHelper.getFirstExampleTime());
    assertSame(3, differentUsers);
  }

  @Test
  public void testAuthorCountSecondExample() throws ParseException {
    final int differentUsers =
      scmCalculationService.getNodeValue(ScmTestDataHelper.getSecondExample(), ScmTestDataHelper.getSecondExampleTime());
    assertSame(2, differentUsers);
  }

}
