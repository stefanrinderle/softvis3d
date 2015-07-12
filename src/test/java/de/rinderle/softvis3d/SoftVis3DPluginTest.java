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
package de.rinderle.softvis3d;

import org.junit.Test;
import org.sonar.api.Extension;

import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

/**
 * Created by stefan on 10.07.15.
 */
public class SoftVis3DPluginTest {

  @Test
  public void testGetExtensions() throws Exception {

    final SoftVis3DPlugin plugin = new SoftVis3DPlugin();

    List<Class<? extends Extension>> extenstions = plugin.getExtensions();

    assertEquals(3, extenstions.size());
  }

  @Test
  public void testProdSet() throws Exception {
    assertTrue(SoftVis3DPlugin.IS_PROD);
  }

}
