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
import { CityBuilderTab } from "../../classes/CityBuilderTab";
import { lazyInject } from "../../inversify.config";
import AppStatusStore from "../../stores/AppStatusStore";
import CityBuilderStore from "../../stores/CityBuilderStore";
import SceneStore from "../../stores/SceneStore";
import AdvancedAnalysisOptions from "./AdvancedAnalysisOptions";
import OptionsSimple from "./OptionsSimple";

export interface CityBuilderProps {
    baseUrl?: string;
}

@observer
export default class CityBuilder extends React.Component<CityBuilderProps, any> {
    @lazyInject("SceneStore")
    private readonly sceneStore!: SceneStore;
    @lazyInject("CityBuilderStore")
    private readonly cityBuilderStore!: CityBuilderStore;
    @lazyInject("AppStatusStore")
    private readonly appStatusStore!: AppStatusStore;

    private tabList = [
        {
            name: CityBuilderTab.Default,
            label: "Options",
            content: <OptionsSimple baseUrl={this.props.baseUrl} />,
        },
        {
            name: CityBuilderTab.OptionAnalysis,
            label: "Advanced options",
            content: <AdvancedAnalysisOptions />,
        },
    ];

    public render() {
        if (!(this.cityBuilderStore.show && !this.appStatusStore.isVisible)) {
            return <div />;
        }

        return (
            <div className="city-builder">
                <div>
                    <ul className="tabrow">
                        {this.tabList.map((tab, i) => (
                            <li
                                id={"city-builder-tab-" + tab.name}
                                key={i}
                                onClick={() => this.setCurrentTab(tab.name)}
                                className={
                                    tab.name === this.cityBuilderStore.currentTab ? "selected" : ""
                                }
                            >
                                {tab.label}
                            </li>
                        ))}
                    </ul>
                </div>

                {this.tabList.map((tab, i) => {
                    if (tab.name === this.cityBuilderStore.currentTab) {
                        return (
                            <div className="tab-content" key={i}>
                                {tab.content}
                            </div>
                        );
                    } else {
                        return null;
                    }
                })}

                {this.renderButtons()}
            </div>
        );
    }

    private renderButtons() {
        if (!this.sceneStore.isVisible) {
            return (
                <div className="buttons">
                    <button onClick={() => this.loadScene()}>Load Scene</button>
                </div>
            );
        }

        return (
            <div className="buttons">
                <button className="left" onClick={() => this.loadScene()}>
                    Load Scene
                </button>
                <button className="right" onClick={() => this.close()}>
                    Close
                </button>
            </div>
        );
    }

    private loadScene() {
        this.cityBuilderStore.show = false;
        this.cityBuilderStore.initiateBuildProcess = true;
    }

    private close() {
        this.cityBuilderStore.show = false;
    }

    private setCurrentTab(name: CityBuilderTab) {
        this.cityBuilderStore.currentTab = name;
    }
}
