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

import org.junit.Test;

import static org.junit.Assert.assertEquals;

/**
 * Created by stefan on 12.07.15.
 */
public class DotExecutorExceptionTest {

  @Test
  public void testMessage() {
    final String message = "message";
    final DotExecutorException underTest = new DotExecutorException(message);

    assertEquals(message, underTest.getMessage());
  }

  @Test
  public void testCause() {
    final String message = "message";
    final IllegalArgumentException exception = new IllegalArgumentException(message);
    final DotExecutorException underTest = new DotExecutorException(message, exception);

    assertEquals(message, underTest.getMessage());
    assertEquals(exception, underTest.getCause());
  }

}
