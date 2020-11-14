import {observer} from "mobx-react";
import * as React from "react";
import AppStatusStore from "../../stores/AppStatusStore";
import CityBuilderStore from "../../stores/CityBuilderStore";
import SceneStore from "../../stores/SceneStore";
import OptionsAdvanced from "./OptionsAdvanced";
import OptionsSimple from "./OptionsSimple";

export interface CityBuilderProps {
    store: CityBuilderStore;
    appStatusStore: AppStatusStore;
    sceneStore: SceneStore;
    baseUrl?: string;
}

@observer
export default class CityBuilder extends React.Component<CityBuilderProps, any> {

    public render() {
        if (!(this.props.store.show && !this.props.appStatusStore.isVisible)) {
            return <div />;
        }

        return (
            <div className="city-builder">
                <OptionsSimple store={this.props.store} baseUrl={this.props.baseUrl}/>
                <OptionsAdvanced store={this.props.store} />

                { this.renderButtons() }
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
}
