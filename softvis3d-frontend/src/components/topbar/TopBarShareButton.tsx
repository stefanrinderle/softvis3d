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
import ClipBoardService from "../../services/ClipBoardService";
import VisualizationLinkService from "../../services/VisualizationLinkService";
import SceneStore from "../../stores/SceneStore";

interface TopBarShareButtonProbs {
    disabled: boolean;
    sceneStore: SceneStore;
}

interface TopBarShareButtonStates {
    isVisible: boolean;
}

@observer
export default class TopBarShareButton extends React.Component<
    TopBarShareButtonProbs,
    TopBarShareButtonStates
> {
    @lazyInject("VisualizationLinkService")
    private readonly visualizationLinkService!: VisualizationLinkService;
    @lazyInject("ClipBoardService")
    private readonly clipBoardService!: ClipBoardService;

    public componentWillMount() {
        this.setShareMenuState(false);
    }

    public render() {
        return (
            <div
                className="dropdown"
                onMouseEnter={() => this.setShareMenuState(true)}
                onMouseLeave={() => this.setShareMenuState(false)}
            >
                <button className="middle" disabled={this.props.disabled}>
                    Share
                </button>
                <div className={this.getShareMenuClassName()}>
                    <button onClick={this.copyVisualizationLink.bind(this)}>
                        Copy to clipboard
                    </button>
                    <button onClick={this.openVisualizationLink.bind(this)}>Open in new tab</button>
                    <button onClick={this.openPlainVisualizationLink.bind(this)}>
                        Open in new plain tab
                    </button>
                </div>
            </div>
        );
    }

    private getShareMenuClassName(): string {
        const classes: string[] = [];

        classes.push("dropdown-menu");

        if (this.state.isVisible) {
            classes.push("open");
        }

        return classes.join(" ");
    }

    private setShareMenuState(value: boolean) {
        this.setState({
            isVisible: value && !this.props.disabled,
        });
    }

    private openVisualizationLink() {
        window.open(this.visualizationLinkService.createVisualizationLink(this.props.sceneStore));
        this.setShareMenuState(false);
    }

    private copyVisualizationLink() {
        const link = this.visualizationLinkService.createVisualizationLink(this.props.sceneStore);
        this.clipBoardService.copyTextToClipboard(link);
        this.setShareMenuState(false);
    }

    private openPlainVisualizationLink() {
        const result: string = this.visualizationLinkService.createPlainVisualizationLink(
            this.props.sceneStore
        );
        window.open(result);

        this.setShareMenuState(false);
    }
}
