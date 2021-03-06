///
/// softvis3d-frontend
/// Copyright (C) 2020 Stefan Rinderle and Yvo Niedrich
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

import Profile from "./Profile";
import Layout from "./Layout";

export class PreviewPicture {
    public readonly bgPicture: string;

    private readonly layout?: Layout;
    private readonly profile?: Profile;

    constructor(bgPicture: string, layout?: Layout, profile?: Profile) {
        this.layout = layout;
        this.profile = profile;
        this.bgPicture = bgPicture;
    }

    public forLayout(l: Layout): boolean {
        if (this.layout) {
            return l.id === this.layout.id;
        } else {
            return false;
        }
    }

    public forProfile(p: Profile): boolean {
        if (this.profile) {
            return p.id === this.profile.id;
        } else {
            return false;
        }
    }
}
