import * as React from "react";
import {observer} from "mobx-react";
import SideBarNodeList from "./SideBarNodeList";
import SideBarSelectParent from "./SideBarSelectParent";
import { SceneStore } from "../../stores/SceneStore";

interface SideBarProps {
    sceneStore: SceneStore;
    selectedElement: TreeElement | null;
}

@observer export default class SideBar extends React.Component<SideBarProps, any> {
    public render() {
        if (this.props.selectedElement === null) {
            return <div></div>;
        }

        return (
            <div className="side-bar">
                <h3>{this.props.selectedElement.name}</h3>
                <SideBarSelectParent sceneStore={this.props.sceneStore} selectedElement={this.props.selectedElement} />
                <SideBarNodeList sceneStore={this.props.sceneStore} selectedElement={this.props.selectedElement} />
            </div>
        );
    }

}
