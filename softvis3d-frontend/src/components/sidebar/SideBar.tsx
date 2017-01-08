import * as React from "react";
import {observer} from "mobx-react";
import NodeList from "./NodeList";
import SelectParent from "./SelectParent";
import { SceneStore } from "../../stores/SceneStore";

interface SideBarProps {
    sceneStore: SceneStore;
}

@observer
export default class SideBar extends React.Component<SideBarProps, any> {
    public render() {
        const {sceneStore} = this.props;

        if (sceneStore.selectedElement === null) {
            return <div id="app-sidebar" className="side-bar"></div>;
        }

        return (
            <div id="app-sidebar" className="side-bar">
                <h3>{sceneStore.selectedElement.name}</h3>
                <SelectParent sceneStore={sceneStore} selectedElement={sceneStore.selectedElement} />
                <NodeList sceneStore={sceneStore} selectedElement={sceneStore.selectedElement} />
            </div>
        );
    }

}
