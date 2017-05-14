import * as React from "react";
import {observer} from "mobx-react";
import NodeList from "./FolderContent";
import ParentElement from "./ParentElement";
import {SceneStore} from "../../stores/SceneStore";
import ActiveFolder from "./ActiveFolder";
import {TreeElement} from "../../classes/TreeElement";

interface SideBarProps {
    sceneStore: SceneStore;
}

@observer
export default class SideBar extends React.Component<SideBarProps, any> {
    public render() {
        const {sceneStore} = this.props;

        if (sceneStore.selectedElement === null) {
            return <div id="app-sidebar" className="side-bar" />;
        }

        const activeFolder = this.getActiveFolder(sceneStore.selectedElement);

        return (
            <div id="app-sidebar" className="side-bar">
                <h3>{sceneStore.selectedElement.name}</h3>
                <ParentElement sceneStore={sceneStore} selectedElement={sceneStore.selectedElement} />
                <ActiveFolder sceneStore={sceneStore} activeFolder={activeFolder} />
                <NodeList sceneStore={sceneStore} activeFolder={activeFolder} />
            </div>
        );
    }

    private getActiveFolder(element: TreeElement): TreeElement | null {
        return element.isFile
            ? this.getParentElement(element)
            : element;
    }

    private getParentElement(element: TreeElement): TreeElement | null {
        if (!this.props.sceneStore.projectData) {
            return null;
        }

        return element.parent ? element.parent : null;
    }

}
