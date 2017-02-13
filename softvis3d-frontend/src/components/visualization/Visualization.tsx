import * as React from "react";
import { observer } from "mobx-react";
import TopBar from "../topbar/TopBar";
import Scene from "../scene/Scene";
import { CityBuilderStore } from "../../stores/CityBuilderStore";
import { SceneStore } from "../../stores/SceneStore";
import SideBar from "../sidebar/SideBar";

interface VisualizationProps {
    sceneStore: SceneStore;
    cityBuilderStore: CityBuilderStore;
}

@observer
export default class Visualization extends React.Component<VisualizationProps, any> {
    public render() {
        const {cityBuilderStore, sceneStore} = this.props;

        if (!sceneStore.isVisible) {
            return (
                <div className="visualisation">
                    <TopBar cityBuilderStore={cityBuilderStore} sceneStore={sceneStore}/>
                </div>
            );
        }

        return (
            <div className="visualisation">
                <TopBar cityBuilderStore={cityBuilderStore} sceneStore={sceneStore}/>
                <Scene sceneStore={sceneStore}/>
                <SideBar sceneStore={sceneStore}/>
            </div>
        );
    }

}
