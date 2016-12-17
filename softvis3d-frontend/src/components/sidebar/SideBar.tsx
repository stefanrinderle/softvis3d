import * as React from "react";
import {observer} from "mobx-react";
import SideBarNodeList from "./SideBarNodeList";
import SideBarSelectParent from "./SideBarSelectParent";
import { SceneStore } from "../../stores/SceneStore";

interface SideBarProps {
    sceneStore: SceneStore;
    selectedElement: TreeElement | null;
    parentElement: TreeElement | null;
}

@observer export default class SideBar extends React.Component<SideBarProps, any> {
    public render() {
        if (this.props.selectedElement === null) {
            return <div></div>;
        }

        return (
            <div className="side-bar">
                <SideBarSelectParent sceneStore={this.props.sceneStore} parentElement={this.props.parentElement} />
                <SideBarNodeList
                    selectedElement={this.props.selectedElement}
                    parentElement={this.props.parentElement}
                    sceneStore={this.props.sceneStore}
                />
            </div>
        );
    }

}
