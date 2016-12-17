import * as React from "react";
import {observer} from "mobx-react";
import SideBarElementInfo from "./SideBarElementInfo";
import {SceneStore} from "../../stores/SceneStore";
import {TreeService} from "../../layout/TreeService";

interface SideBarLeafInfoProps {
    selectedElement: TreeElement;
    sceneStore: SceneStore;
}

@observer export default class SideBarNodeList extends React.Component<SideBarLeafInfoProps, any> {
    public render() {
        const folder = this.props.selectedElement.isNode
            ? this.props.selectedElement
            : this.getParentElement(this.props.selectedElement);

        if (folder === null) {
            return <ul>
                <li>ERROR</li>
            </ul>;
        }

        let folderElements: JSX.Element[] = [];
        for (let child of folder.children) {
            const elementId = folder.name + "/" + child.name;
            const isSelected = child.id === this.props.selectedElement.id;

            folderElements.push(
                <SideBarElementInfo
                    key={elementId}
                    element={child}
                    isSelected={isSelected}
                    sceneStore={this.props.sceneStore}
                />
            );
        }

        return (
            <div>
                <h3>{folder.name}</h3>
                <ul className="node-list">
                    {folderElements}
                </ul>;
            </div>
        );
    }

    private getParentElement(element: TreeElement) {
        if (!this.props.sceneStore.legacyData) {
            return null;
        }

        return TreeService.searchParentNode(this.props.sceneStore.legacyData, element);
    }
}
