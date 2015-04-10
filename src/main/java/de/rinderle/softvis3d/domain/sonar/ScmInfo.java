/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 - Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
package de.rinderle.softvis3d.domain.sonar;

import java.util.Date;

public class ScmInfo {
    private int line;
    private String committer;
    private Date timestamp;

    public ScmInfo(int line, String committer, Date timestamp) {
        this.line = line;
        this.committer = committer;
        this.timestamp = timestamp;
    }

    public ScmInfo(int line, String committer) {
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
