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

export default class LoadingImage extends React.Component<Record<string, unknown>, any> {
    public render() {
        return (
            <div>
                <span className="cssload-label">Loading...</span>
                <div className="cssload-container">
                    <div className="cssload-cord cssload-leftMove">
                        <div className="cssload-ball"/>
                    </div>
                    <div className="cssload-cord">
                        <div className="cssload-ball"/>
                    </div>
                    <div className="cssload-cord">
                        <div className="cssload-ball"/>
                    </div>
                    <div className="cssload-cord">
                        <div className="cssload-ball"/>
                    </div>
                    <div className="cssload-cord">
                        <div className="cssload-ball"/>
                    </div>
                    <div className="cssload-cord">
                        <div className="cssload-ball"/>
                    </div>
                    <div className="cssload-cord cssload-rightMove">
                        <div className="cssload-ball"/>
                    </div>
                    <div className="cssload-shadows">
                        <div className="cssload-leftShadow"/>
                        <div/>
                        <div/>
                        <div/>
                        <div/>
                        <div/>
                        <div className="cssload-rightShadow"/>
                    </div>
                </div>
            </div>
        );
    }
}
