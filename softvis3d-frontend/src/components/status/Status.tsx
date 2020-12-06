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
import {observer} from "mobx-react";
import AppStatusStore from "../../stores/AppStatusStore";
import Loading from "./loading/Loading";
import SoftVis3DLogo from "./SoftVis3DLogo";
import ErrorStatus from "./ErrorStatus";
import InfoStatus from "./InfoStatus";

@observer
export default class Status extends React.Component<{ appStatusStore: AppStatusStore; }, any> {
    public render() {
        if (!this.props.appStatusStore.isVisible) {
            return <div />;
        }

        return (
            <div className="status-component">
                <SoftVis3DLogo/>

                <InfoStatus appStatusStore={this.props.appStatusStore}/>
                <Loading appStatusStore={this.props.appStatusStore}/>
                <ErrorStatus appStatusStore={this.props.appStatusStore}/>
            </div>
        );
    }

}
