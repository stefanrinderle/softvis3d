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

import * as React from "react";
import { PreviewPicture } from "../../classes/PreviewPicture";
import { lazyInject } from "../../inversify.config";
import ComponentStatusStore from "../../stores/ComponentStatusStore";

export interface PreviewPictureComponentProps {
    previewPicture: PreviewPicture;
}

export default class PreviewPictureComponent extends React.Component<
    PreviewPictureComponentProps,
    any
> {
    @lazyInject("ComponentStatusStore")
    private readonly componentStatusStore!: ComponentStatusStore;

    public render() {
        const preview: PreviewPicture = this.props.previewPicture;

        let url: string = preview.bgPicture;
        const baseUrl = this.componentStatusStore.appConfiguration.baseUrl;
        if (baseUrl) {
            url = baseUrl + url;
        }

        const previewStyle = {
            backgroundImage: "url(" + url + ")",
        };

        return <div className={"preview"} style={previewStyle}></div>;
    }
}
