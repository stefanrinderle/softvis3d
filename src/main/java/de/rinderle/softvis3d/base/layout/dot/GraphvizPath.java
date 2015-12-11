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

/**
 * Created by srinderle on 27.11.2015.
 */
public class GraphvizPath {

  private final String dotPath;
  private final String gvprExecutable;

  public GraphvizPath(final String settingsDotBinPath, final boolean isWindows) {
    final String normalized = normalizeSlashes(settingsDotBinPath, isWindows);
    final String basePath = getBasePath(normalized, isWindows);

    this.dotPath = checkEscapeCommand(basePath + "dot", isWindows);
    this.gvprExecutable = checkEscapeCommand(basePath + "gvpr", isWindows);
  }

  private String getBasePath(final String normalizedSource, final boolean isWindows) {
    final int lastIndex;
    if (isWindows) {
      lastIndex = normalizedSource.lastIndexOf("\\");
    } else {
      lastIndex = normalizedSource.lastIndexOf("/");
    }

    return normalizedSource.substring(0, lastIndex + 1);
  }

  private String checkEscapeCommand(final String source, final boolean isWindows) {
    if (isWindows) {
      return "\"" + source + "\"";
    } else {
      return source.replace(" ", "\\ ");
    }
  }

  private String normalizeSlashes(final String settingsDotBinPath, final boolean isWindows) {
    if (isWindows) {
      return settingsDotBinPath.replace("/", "\\\\");
    } else {
      return settingsDotBinPath.replace("\\", "/");
    }
  }

  public String getDotExecutable() {
    return dotPath;
  }

  public String getGvprExecutable() {
    return gvprExecutable;
  }
}
