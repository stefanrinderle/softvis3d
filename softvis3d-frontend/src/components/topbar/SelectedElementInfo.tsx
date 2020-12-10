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
import SelectedElementService from "../../services/SelectedElementService";

@observer
export default class SelectedElementInfo extends React.Component<Record<string, unknown>, any> {
    @lazyInject("SelectedElementService")
    private readonly selectedElementService!: SelectedElementService;

    public render() {
        const selectedElement = this.selectedElementService.getSelectedElement();

        if (selectedElement === null) {
            return (
                <div className="selected-element-info">
                    <span className="no-info">Select an object to see the details here</span>
                </div>
            );
        }

        const classes = ["selected-element-info", selectedElement.isFile() ? "leaf" : "node"];

        return (
            <div>
                <div className={classes.join(" ")}>
                    <span className="element-name">{selectedElement.name}</span>
                    {this.renderButtons(selectedElement.isFile())}
                </div>
            </div>
        );
    }

    private renderButtons(isFile: boolean) {
        if (!isFile) {
            return null;
        }

        return (
            <div className="info-buttons">
                <button
                    id="open-file-button"
                    className="left"
                    onClick={() => {
                        this.openSourceCode();
                    }}
                >
                    Open file
                </button>
                <button
                    id="open-measures-button"
                    className="right"
                    onClick={() => {
                        this.openMeasures();
                    }}
                >
                    Open measures
                </button>
            </div>
        );
    }

    private openSourceCode() {
        const selectedElement = this.selectedElementService.getSelectedElement();
        if (selectedElement && selectedElement.key) {
            this.open("/code", selectedElement.key);
        }
    }

    private openMeasures() {
        const selectedElement = this.selectedElementService.getSelectedElement();
        if (selectedElement && selectedElement.key) {
            this.open("/component_measures", selectedElement.key);
        }
    }

    private open(newLocation: string, id: string) {
        const baseUrl: string = (window as any).baseUrl;
        let result = "";
        if (baseUrl) {
            result = baseUrl;
        }
        result = result + newLocation + "?id=" + id;
        window.open(result);
    }
}
