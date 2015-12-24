/*
 * softvis3d-base
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
package de.rinderle.softvis3d.base.layout.dot;

import org.junit.Test;

import static org.junit.Assert.assertEquals;

/**
 * Created by stefan on 12.07.15.
 */
public class VersionTest {

  @Test
  public void test() {
    final String versionString1 = "1.20.2";
    final String versionString2 = "2.20.2";
    final String versionString3 = "2.20.2";
    final String versionString4 = "2.20.3";

    final Version version1 = new Version(versionString1);
    final Version version2 = new Version(versionString2);
    final Version version3 = new Version(versionString3);
    final Version version4 = new Version(versionString4);

    assertEquals(-1, version1.compareTo(version2));
    assertEquals(0, version2.compareTo(version3));
    assertEquals(0, version3.compareTo(version2));
    assertEquals(1, version4.compareTo(version3));
  }

}
