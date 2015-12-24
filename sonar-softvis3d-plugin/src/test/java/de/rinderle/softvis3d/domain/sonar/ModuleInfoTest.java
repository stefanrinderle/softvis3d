/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2015 Stefan Rinderle
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
package de.rinderle.softvis3d.domain.sonar;

import org.junit.Assert;
import org.junit.Test;

public class ModuleInfoTest {

  @Test
  public void testGetter() throws Exception {
    final Integer id = 12213;
    final String name = "testName";
    final ModuleInfo moduleInfo = new ModuleInfo(id, name);

    Assert.assertEquals(id, moduleInfo.getId());
    Assert.assertEquals(name, moduleInfo.getName());
  }

  @Test(expected = IllegalArgumentException.class)
  public void testNullId() throws Exception {
    new ModuleInfo(null, "testName");
  }

  @Test(expected = IllegalArgumentException.class)
  public void testNullDescription() throws Exception {
    new ModuleInfo(123, null);
  }

}
