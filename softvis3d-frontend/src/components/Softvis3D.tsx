import * as React from "react";
import {observer} from "mobx-react";
import CityBuilder from "./CityBuilder/CityBuilder";
import Status from "./Status";
import {AppStatusStore} from "../stores/AppStatusStore";
import {CityBuilderStore} from "../stores/CityBuilderStore";
import {SceneStore} from "../stores/SceneStore";
import Visualization from "./visualization/Visualization";

@observer export default class Softvis3D extends React.Component
            <{appStatusStore: AppStatusStore, sceneStore: SceneStore, cityBuilderStore: CityBuilderStore}, any> {

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
        if (!this.props.appStatusStore.isVisible) {
            return null;
        }

        return (
            <Status/>
        );
    }

    private renderBuilder() {
        if (!this.props.cityBuilderStore.isVisible) {
            return null;
        }

        return (
            <CityBuilder store={this.props.cityBuilderStore}/>
        );
    }

    private renderScene() {
        if (!this.props.sceneStore.isVisible) {
            return null;
        }

        return (
            <Visualization cityBuilderStore={this.props.cityBuilderStore} sceneStore={this.props.sceneStore}/>
        );
    }
}
