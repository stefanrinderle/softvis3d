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
import AppStatusStore from "../../../stores/AppStatusStore";
import StatusActionQueue from "../../../classes/status/StatusActionQueue";
import LoadAction from "../../../classes/status/LoadAction";

export default class LoadingQueue extends React.Component<{ appStatusStore: AppStatusStore }, any> {
    public render() {
        const queue: StatusActionQueue<LoadAction> = this.props.appStatusStore.loadingQueue;

        const elements: Array<React.ReactElement<any>> = [];
        for (const queueElement of queue) {
            if (queueElement.hasStatus()) {
                elements.push(
                    <li key={queueElement.key}>
                        <span className="status-description">{queueElement.description}</span>
                        <span className="status-percent">{queueElement.percent}%</span>
                        <span className="status-absolute">
                            {queueElement.current} of {queueElement.max}
                        </span>
                    </li>
                );
            } else {
                elements.push(<li key={queueElement.key}>{queueElement.description}</li>);
            }
        }

        return <ul className="events">{elements}</ul>;
    }
}
