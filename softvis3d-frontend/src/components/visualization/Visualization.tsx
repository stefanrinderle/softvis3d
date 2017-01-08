import * as React from "react";
import { observer } from "mobx-react";
import TopBar from "../topbar/TopBar";
import Scene from "../scene/Scene";
import BottomBar from "../bottombar/BottomBar";
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
        const {sceneStore} = this.props;

        if (!sceneStore.isVisible) {
            return <div />;
        }

        return (
            <div className="visualisation">
                <TopBar cityBuilderStore={this.props.cityBuilderStore} sceneStore={sceneStore}/>
                <Scene sceneStore={sceneStore}/>
                <SideBar sceneStore={sceneStore}/>
                <BottomBar cityBuilderStore={this.props.cityBuilderStore} sceneStore={sceneStore}/>
            </div>
        );
    }

}
