import * as React from "react";
import {observer} from "mobx-react";
import TopBar from "../topbar/TopBar";
import Scene from "../scene/Scene";
import BottomBar from "../bottombar/BottomBar";
import {CityBuilderStore} from "../../stores/CityBuilderStore";
import {SceneStore} from "../../stores/SceneStore";

@observer
export default class VisualizationComponent
        extends React.Component<{ sceneStore: SceneStore; cityBuilderStore: CityBuilderStore}, any> {

    public render() {
        return (
            <div>
                <TopBar cityBuilderStore={this.props.cityBuilderStore} sceneStore={this.props.sceneStore}/>
                <Scene/>
                <BottomBar cityBuilderStore={this.props.cityBuilderStore}/>
            </div>
        );
    }

}
