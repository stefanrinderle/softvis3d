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

interface KeyLegendProps {
    show?: boolean;
}

export class KeyLegend extends React.Component<KeyLegendProps, any> {

    public static defaultProps = {
        show: true
    };

    public render() {
        const {show} = this.props;

        if (!show) {
            return <div />;
        }

        return (
            <div className="key-legend">
                <table>
                    <tbody>
                        <tr>
                            <td><div className="mouse-key mouse-left" /></td>
                            <td><span>Rotate</span></td>
                        </tr>
                        <tr>
                            <td><div className="mouse-key mouse-middle" /></td>
                            <td><span>Zoom</span></td>
                        </tr>
                        <tr>
                            <td><div className="mouse-key mouse-right" /></td>
                            <td><span>Move</span></td>
                        </tr>
                        <tr>
                            <td><div className="keyboard-key">R</div></td>
                            <td><span>Reset Camera</span></td>
                        </tr>
                        <tr>
                            <td><div className="keyboard-key">L</div></td>
                            <td><span>Toggle Legend</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}
