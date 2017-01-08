import * as React from "react";
import {observer} from "mobx-react";
import ElementInfo from "./ElementInfo";
import {SceneStore} from "../../stores/SceneStore";
import {TreeService} from "../../layout/TreeService";

interface NodeListProps {
    selectedElement: TreeElement;
    sceneStore: SceneStore;
}

@observer
export default class NodeList extends React.Component<NodeListProps, any> {
    public render() {
        const folder = this.props.selectedElement.isNode
            ? this.props.selectedElement
            : this.getParentElement(this.props.selectedElement);

        if (folder === null) {
            // TODO: "Error" is not the Way to go :-/
            return <ul>
                <li>ERROR</li>
            </ul>;
        }

        let folderElements: JSX.Element[] = [
            <ElementInfo
                key={folder.id}
                element={folder}
                selected={folder.id === this.props.selectedElement.id}
                origin={true}
                sceneStore={this.props.sceneStore}
            />
        ];
        for (let child of folder.children) {
            folderElements.push(
                <ElementInfo
                    key={child.id}
                    element={child}
                    selected={child.id === this.props.selectedElement.id}
                    sceneStore={this.props.sceneStore}
                />
            );
        }

        return (
            <ul className="node-list">
                {folderElements}
            </ul>
        );
    }

    private getParentElement(element: TreeElement) {
        if (!this.props.sceneStore.legacyData) {
            return null;
        }

        return TreeService.searchParentNode(this.props.sceneStore.legacyData, element);
    }
}
