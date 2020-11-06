import {observer} from "mobx-react";
import * as React from "react";
import {CityBuilderStore} from "../../stores/CityBuilderStore";
import {SceneStore} from "../../stores/SceneStore";
import Scene from "../scene/Scene";
import SideBar from "../sidebar/SideBar";
import TopBar from "../topbar/TopBar";

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
