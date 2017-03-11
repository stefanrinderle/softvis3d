import * as React from "react";
import { observer } from "mobx-react";
import TopBar from "../topbar/TopBar";
import Scene from "../scene/Scene";
import { CityBuilderStore } from "../../stores/CityBuilderStore";
import { SceneStore } from "../../stores/SceneStore";
import SideBar from "../sidebar/SideBar";
import VisualizationLinkService from "../../services/VisualizationLinkService";

interface VisualizationProps {
    sceneStore: SceneStore;
    cityBuilderStore: CityBuilderStore;
    visualizationLinkService: VisualizationLinkService;
}

@observer
export default class Visualization extends React.Component<VisualizationProps, any> {
    public render() {
        const {cityBuilderStore, sceneStore, visualizationLinkService} = this.props;

        if (!sceneStore.isVisible) {
            return (
                <div className="visualisation">
                    <TopBar cityBuilderStore={cityBuilderStore} sceneStore={sceneStore}
                            visualizationLinkService={visualizationLinkService}/>
                </div>
            );
        }

        return (
            <div className="visualisation">
                <TopBar cityBuilderStore={cityBuilderStore} sceneStore={sceneStore}
                        visualizationLinkService={visualizationLinkService}/>
                <Scene sceneStore={sceneStore}/>
                <SideBar sceneStore={sceneStore}/>
            </div>
        );
    }

}
