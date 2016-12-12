import * as React from "react";
import {observer} from "mobx-react";
import SideBarSingleElementInfo from "./SideBarSingleElementInfo";
import {SceneStore} from "../../stores/SceneStore";

@observer
export default class SideBarNodeInfo extends
        React.Component<{ selectedElement: TreeElement; sceneStore: SceneStore }, any> {

    public render() {
        let folderElements: JSX.Element[] = [];

        let children: TreeElement[] = this.props.selectedElement.children;
        for (let i = 0; i < children.length; i++) {
            folderElements.push(
                <SideBarSingleElementInfo element={children[i]}
                                          isCurrentSelectedElement={false}
                                          sceneStore={this.props.sceneStore}/>);
        }

        return <ul>{folderElements}</ul>
    }

}
