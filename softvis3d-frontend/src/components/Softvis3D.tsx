import * as React from "react";
import CityBuilder from "./CityBuilder/CityBuilder";
import Loader from "./Loader";
import SceneComponent from "./scene/SceneComponent";
import cityBuilderStore from "../stores/CityBuilderStore";
import TopBar from "./TopBar";
import windowStateStore from "../stores/WindowStateStore";
import {observer} from "mobx-react";

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
        if (!windowStateStore.showLoader) {
            return null;
        }

        return (
            <Loader queue={windowStateStore.loadingEvents.slice()}/>
        );
    }

    private renderBuilder() {
        if (!windowStateStore.showBuilder) {
            return null;
        }

        return (
            <CityBuilder store={cityBuilderStore}/>
        );
    }

    private renderScene() {
        if (!windowStateStore.showScene) {
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
