import * as React from "react";
import {observer} from "mobx-react";
import NodeList from "./NodeList";
import SelectParent from "./SelectParent";
import { SceneStore } from "../../stores/SceneStore";

interface SideBarProps {
    sceneStore: SceneStore;
    selectedElement: TreeElement | null;
}

@observer export default class SideBar extends React.Component<SideBarProps, any> {
    public render() {
        if (this.props.selectedElement === null) {
            return <div id="app-sidebar" className="side-bar"></div>;
        }

        return (
            <div id="app-sidebar" className="side-bar">
                <h3>{this.props.selectedElement.name}</h3>
                <SelectParent sceneStore={this.props.sceneStore} selectedElement={this.props.selectedElement} />
                <NodeList sceneStore={this.props.sceneStore} selectedElement={this.props.selectedElement} />
            </div>
        );
    }

}
