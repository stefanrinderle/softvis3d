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
package de.rinderle.softvis3d.domain;

import java.util.Date;

public class ScmInfo {
  private final int line;
  private final String committer;
  private final Date timestamp;

  public ScmInfo(final int line, final String committer, final Date timestamp) {
    this.line = line;
    this.committer = committer;
    this.timestamp = timestamp;
  }

  public ScmInfo(final int line, final String committer) {
    this.line = line;
    this.committer = committer;
    this.timestamp = new Date();
  }

  public int getLine() {
    return line;
  }

  public String getCommitter() {
    return committer;
  }

  public Date getTimestamp() {
    return timestamp;
  }

  @Override
  public String toString() {
    return "ScmInfo{" + "line=" + line + ", committer='" + committer + '\'' + ", timestamp=" + timestamp + '}';
  }
}
