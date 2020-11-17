import {observer} from "mobx-react";
import * as React from "react";
import {CityBuilderTab} from "../../classes/CityBuilderTab";
import AppStatusStore from "../../stores/AppStatusStore";
import CityBuilderStore from "../../stores/CityBuilderStore";
import SceneStore from "../../stores/SceneStore";
import AdvancedAnalysisOptions from "./AdvancedAnalysisOptions";
import OptionsSimple from "./OptionsSimple";

export interface CityBuilderProps {
    store: CityBuilderStore;
    appStatusStore: AppStatusStore;
    sceneStore: SceneStore;
    baseUrl?: string;
}

@observer
export default class CityBuilder extends React.Component<CityBuilderProps, any> {

    private tabList = [
        {
            name: CityBuilderTab.Default,
            label: "Options",
            content: (
                <OptionsSimple store={this.props.store} baseUrl={this.props.baseUrl}/>
            )
        },
        {
            name: CityBuilderTab.OptionAnalysis,
            label: "Advanced options",
            content: (
                <AdvancedAnalysisOptions store={this.props.store}/>
            )
        }
    ];

    public render() {
        if (!(this.props.store.show && !this.props.appStatusStore.isVisible)) {
            return <div/>;
        }

        return (
            <div className="city-builder">
                <div>
                    <ul className="tabrow">
                        {
                            this.tabList.map((tab, i) => (
                                <li id={"city-builder-tab-" + tab.name}
                                    key={i}
                                    onClick={() => this.setCurrentTab(tab.name)}
                                    className={(tab.name === this.props.store.currentTab) ? "selected" : ""}>
                                    {tab.label}
                                </li>
                            ))
                        }
                    </ul>
                </div>

                {
                    this.tabList.map((tab, i) => {
                        if (tab.name === this.props.store.currentTab) {
                            return <div className="tab-content" key={i}>{tab.content}</div>;
                        } else {
                            return null;
                        }
                    })
                }

                {this.renderButtons()}
            </div>
        );
    }

    private renderButtons() {
        if (!this.props.sceneStore.isVisible) {
            return (
                <div className="buttons">
                    <button onClick={() => this.loadScene()}>Load Scene</button>
                </div>
            );
        }

        return (
            <div className="buttons">
                <button className="left" onClick={() => this.loadScene()}>Load Scene</button>
                <button className="right" onClick={() => this.close()}>Close</button>
            </div>
        );

    }

    private loadScene() {
        this.props.store.show = false;
        this.props.store.initiateBuildProcess = true;
    }

    private close() {
        this.props.store.show = false;
    }

    private setCurrentTab(name: CityBuilderTab) {
        this.props.store.currentTab = name;
    }
}
