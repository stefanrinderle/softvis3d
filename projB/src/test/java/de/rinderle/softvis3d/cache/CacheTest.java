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
package de.rinderle.softvis3d.cache;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class CacheTest {

  private final Cache<String, String> underTest = new Cache<>();

  @Test
  public void testSave() {
    final String key = "key";
    final String value = "value";
    underTest.put(key, value);

    assertTrue(underTest.containsKey(key));
    assertFalse(underTest.containsKey(key + "X"));

    assertEquals(value, underTest.get(key));

    assertEquals(1, underTest.size());
  }

  @Test
  public void testLimitNotReached() {
    for (int i = 0; i < Cache.MAX_SIZE; i++) {
      underTest.put("key" + i, "value" + i);
    }

    assertEquals(Cache.MAX_SIZE, underTest.size());
    assertTrue(underTest.containsKey("key0"));
    assertTrue(underTest.containsKey("key4"));
  }

  @Test
  public void testLimitReached() {
    for (int i = 0; i < Cache.MAX_SIZE + 1; i++) {
      underTest.put("key" + i, "value" + i);
    }

    assertEquals(Cache.MAX_SIZE, underTest.size());
    assertFalse(underTest.containsKey("key0"));
    assertTrue(underTest.containsKey("key5"));
  }

  @Test
  public void testLog() {
    for (int i = 0; i < Cache.MAX_SIZE + 1; i++) {
      underTest.put("key" + i, "value" + i);
    }

    underTest.logKeys();
  }

}
