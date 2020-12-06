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

import { observer } from "mobx-react";
import * as React from "react";
import { lazyInject } from "../../inversify.config";
import AppStatusStore from "../../stores/AppStatusStore";
import ErrorStatus from "./ErrorStatus";
import InfoStatus from "./InfoStatus";
import Loading from "./loading/Loading";
import SoftVis3DLogo from "./SoftVis3DLogo";

@observer
export default class Status extends React.Component<Record<string, never>, any> {
    @lazyInject("AppStatusStore")
    private readonly appStatusStore!: AppStatusStore;

    public render() {
        if (!this.appStatusStore.isVisible) {
            return <div />;
        }

        return (
            <div className="status-component">
                <SoftVis3DLogo />

                <InfoStatus />
                <Loading loadingQueue={this.appStatusStore.loadingQueue} />
                <ErrorStatus errors={this.appStatusStore.errors} />
            </div>
        );
    }
}
