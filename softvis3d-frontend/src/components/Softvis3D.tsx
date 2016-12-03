import * as React from "react";
import {observer} from "mobx-react";
import CityBuilder from "./CityBuilder/CityBuilder";
import Status from "./Status";
import appStatusStore from "../stores/AppStatusStore";
import cityBuilderStore from "../stores/CityBuilderStore";
import sceneStore from "../stores/SceneStore";
import VisualizationComponent from "./visualization/VisualizationComponent";

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
            <Status/>
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
                <VisualizationComponent/>
            </div>
        );
    }
}
