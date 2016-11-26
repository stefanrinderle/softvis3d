import * as React from "react";
import {observer} from "mobx-react";
import CityBuilder from "./CityBuilder/CityBuilder";
import Status from "./Status";
import TopBar from "./TopBar";
import SceneComponent from "./scene/SceneComponent";
import appStatusStore from "../stores/AppStatusStore";
import cityBuilderStore from "../stores/CityBuilderStore";
import sceneStore from "../stores/SceneStore";

@observer export default class Softvis3D extends React.Component<{}, any> {
    public render() {
        return (
            <div>
                {this.renderLoader()}
                {this.renderBuilder()}
                {this.renderScene()}
            </div>
        );
    }

    private renderLoader() {
        if (!appStatusStore.isVisible) {
            return null;
        }

        return (
            <Status queue={appStatusStore.loadingQueue.slice()}/>
        );
    }

    private renderBuilder() {
        if (!cityBuilderStore.isVisible) {
            return null;
        }

        return (
            <CityBuilder store={cityBuilderStore}/>
        );
    }

    private renderScene() {
        if (!sceneStore.isVisible) {
            return null;
        }

        return (
            <div>
                <SceneComponent/>
                <TopBar/>
            </div>
        );
    }
}
