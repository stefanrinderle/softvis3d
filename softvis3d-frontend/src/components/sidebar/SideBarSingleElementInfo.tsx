import * as React from "react";
import {SceneStore} from "../../stores/SceneStore";

interface SideBarSingleElementInfoProps {
    element: TreeElement;
    isCurrentSelectedElement: boolean;
    sceneStore: SceneStore;
}

/**
 * Currently used for an example use of selected scene object store.
 */
export default class SideBarSingleElementInfo extends React.Component<SideBarSingleElementInfoProps, any> {

    public render() {
        let classes = ["element-info"];
        if (this.props.isCurrentSelectedElement) {
            classes.push("current-selected");
        }

        return (
            <li className={classes.join(" ")} onClick={() => this.props.isCurrentSelectedElement || this.selectElement()}>
                {this.props.element.name}
            </li>
        );
    }

    private selectElement() {
        this.props.sceneStore.setSelectedObjectId(this.props.element.id);
    }

}
