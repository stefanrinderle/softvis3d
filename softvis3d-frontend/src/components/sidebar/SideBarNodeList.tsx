import * as React from "react";
import {observer} from "mobx-react";
import SideBarElementInfo from "./SideBarElementInfo";
import {SceneStore} from "../../stores/SceneStore";

interface SideBarLeafInfoProps {
    selectedElement: TreeElement;
    parentElement: TreeElement | null;
    sceneStore: SceneStore;
}

@observer export default class SideBarNodeList extends React.Component<SideBarLeafInfoProps, any> {
    public render() {
        const folder = this.props.selectedElement.isNode ? this.props.selectedElement : this.props.parentElement;

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

        return <ul>
            {folderElements}
        </ul>;
    }

}
