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

public class Version implements Comparable<Version> {

  private final String versionNumber;

  public Version(final String versionNumber) {
    if (versionNumber == null) {
      throw new IllegalArgumentException("Version can not be null");
    }

    if (!versionNumber.matches("[0-9]+(\\.[0-9]+)*")) {
      throw new IllegalArgumentException("Invalid version format");
    }

    this.versionNumber = versionNumber;
  }

  public final String get() {
    return this.versionNumber;
  }

  @Override
  public int compareTo(final Version that) {
    if (that == null)
      return 1;
    final String[] thisParts = this.get().split("\\.");
    final String[] thatParts = that.get().split("\\.");
    final int length = Math.max(thisParts.length, thatParts.length);
    for (int i = 0; i < length; i++) {
      final int thisPart = i < thisParts.length ? Integer.parseInt(thisParts[i]) : 0;
      final int thatPart = i < thatParts.length ? Integer.parseInt(thatParts[i]) : 0;
      if (thisPart < thatPart)
        return -1;
      if (thisPart > thatPart)
        return 1;
    }
    return 0;
  }

  @Override
  public boolean equals(final Object that) {
    if (this == that) {
      return true;
    }
    if (that == null) {
      return false;
    }

    return this.getClass() == that.getClass() && this.compareTo((Version) that) == 0;
  }

  @Override
  public int hashCode() {
    return versionNumber.hashCode();
  }
}
