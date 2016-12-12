import * as React from "react";
import {observer} from "mobx-react";
import SideBarSingleElementInfo from "./SideBarSingleElementInfo";
import {SceneStore} from "../../stores/SceneStore";

@observer
export default class SideBarLeafInfo extends React.Component<
        { selectedElement: TreeElement, parentElement: TreeElement | null, sceneStore: SceneStore}, any> {

    public render() {
        let folderElements: JSX.Element[] = [];

        if (this.props.parentElement !== null) {
            let parentChildren: TreeElement[] = this.props.parentElement.children;

            for (let i = 0; i < parentChildren.length; i++) {
                let isCurrentSelectedElement: boolean = false;
                if (parentChildren[i].id === this.props.selectedElement.id) {
                    isCurrentSelectedElement = true;
                }
                folderElements.push(
                    <SideBarSingleElementInfo element={parentChildren[i]}
                                              isCurrentSelectedElement={isCurrentSelectedElement}
                                              sceneStore={this.props.sceneStore}/>);
            }
        }

        return <ul>
            {folderElements}
        </ul>;
    }

}
