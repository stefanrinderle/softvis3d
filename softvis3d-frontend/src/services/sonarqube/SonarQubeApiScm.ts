///
/// softvis3d-frontend
/// Copyright (C) 2016 Stefan Rinderle and Yvo Niedrich
/// stefan@rinderle.info / yvo.niedrich@gmail.com
///
/// This program is free software; you can redistribute it and/or
/// modify it under the terms of the GNU Lesser General Public
/// License as published by the Free Software Foundation; either
/// version 3 of the License, or (at your option) any later version.
///
/// This program is distributed in the hope that it will be useful,
/// but WITHOUT ANY WARRANTY; without even the implied warranty of
/// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
/// Lesser General Public License for more details.
///
/// You should have received a copy of the GNU Lesser General Public
/// License along with this program; if not, write to the Free Software
/// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
///

export default class SonarQubeApiScm {

    public readonly lineNumber: number;
    public readonly authorName: string;
    public readonly lastCommit: string;
    public readonly lastCommitRevision: string;

    constructor(lineNumber: number, authorName: string, lastCommit: string, lastCommitRevision: string) {
        this.lineNumber = lineNumber;
        this.authorName = authorName;
        this.lastCommit = lastCommit;
        this.lastCommitRevision = lastCommitRevision;
    }
}