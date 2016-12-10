import * as React from "react";
import {observer} from "mobx-react";
import TopBar from "../topbar/TopBar";
import Scene from "../scene/Scene";
import BottomBar from "../bottombar/BottomBar";
import {CityBuilderStore} from "../../stores/CityBuilderStore";
import {SceneStore} from "../../stores/SceneStore";
import SideBar from "../sidebar/SideBar";
import {TreeService} from "../../layout/TreeService";

@observer
export default class Visualization
        extends React.Component<{ sceneStore: SceneStore; cityBuilderStore: CityBuilderStore}, any> {

    public render() {
        let selectedElement: TreeElement | null =
            TreeService.searchTreeNode(this.props.sceneStore.legacyData, this.props.sceneStore.selectedObjectId);

        return (
            <div>
                <TopBar cityBuilderStore={this.props.cityBuilderStore} selectedElement={selectedElement}/>
                <Scene/>
                <BottomBar cityBuilderStore={this.props.cityBuilderStore}/>
                <SideBar sceneStore={this.props.sceneStore} selectedElement={selectedElement}/>
            </div>
        );
    }

}
