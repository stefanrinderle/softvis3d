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
import Category from "../ui/Category";

@observer
export default class InfoTab extends React.Component<Record<string, never>, any> {
    public render() {
        return (
            <div>
                <Category label="Help">
                    Please check the&nbsp;
                    <a
                        id="github-page-link"
                        href="https://softvis3d.com/#/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        documentation page
                    </a>
                    &nbsp;for help.
                    <br />
                    If you need further details, please open an issue on github.
                </Category>
                <br />
                <Category label="Feedback / Issues">
                    We are always happy to get some feedback on the plugin usage.
                    <br />
                    Is it not possible to include any tracking info in the plugin, so we don&apos;t
                    know how it is used by you.
                    <br />
                    <b>We need you opinion to improve the plugin.</b>
                    <ul>
                        <li>
                            For new features or issues please open a ticket on&nbsp;
                            <a
                                href="https://github.com/stefanrinderle/softvis3d/issues"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Github
                            </a>
                        </li>
                        <li>
                            Give us a star on&nbsp;
                            <a
                                href="https://github.com/stefanrinderle/softvis3d/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Github
                            </a>
                            &nbsp;if you like the plugin
                        </li>
                        <li>Send and email to stefan@rinderle.info for everything else.</li>
                    </ul>
                </Category>
                <br />
                <Category label="Project info">
                    Licensed under GNU LGPL 3<br />
                    Developed by Stefan Rinderle and Yvo Niedrich
                </Category>
            </div>
        );
    }
}
