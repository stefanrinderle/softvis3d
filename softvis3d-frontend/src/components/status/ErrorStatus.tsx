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
import ErrorAction from "../../classes/status/ErrorAction";
import StatusActionQueue from "../../classes/status/StatusActionQueue";

@observer
export default class ErrorStatus extends React.Component<
    { errors: StatusActionQueue<ErrorAction> },
    any
> {
    public render() {
        if (!this.props.errors.isEmpty) {
            const elements = this.createErrorElements();
            return (
                <div>
                    <h2>An error occured:</h2>
                    <ul className="events">{elements}</ul>
                </div>
            );
        } else {
            return <div />;
        }
    }

    private createErrorElements() {
        const elements: Array<React.ReactElement<any>> = [];

        for (const queueElement of this.props.errors) {
            elements.push(
                <li key={queueElement.key}>
                    {queueElement.description}
                    <br />
                    <br />
                    <div className="buttons">
                        <button onClick={() => queueElement.retryCallback()}>
                            {queueElement.retryButtonText}
                        </button>
                    </div>
                </li>
            );
        }
        return elements;
    }
}
