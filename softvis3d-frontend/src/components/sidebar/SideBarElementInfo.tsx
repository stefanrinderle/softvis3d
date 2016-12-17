import * as React from "react";
import {SceneStore} from "../../stores/SceneStore";

interface SideBarElementInfoProps {
    element: TreeElement;
    isSelected: boolean;
    sceneStore: SceneStore;
}

/**
 * Currently used for an example use of selected scene object store.
 */
export default class SideBarElementInfo extends React.Component<SideBarElementInfoProps, any> {

    public render() {
        let classes = [];
        classes.push(this.props.element.isNode ? "node" : "leaf");

        if (this.props.isSelected) {
            classes.push("current-selected");
        }

        return (
            <li className={classes.join(" ")} onClick={() => this.props.isSelected || this.selectElement()}>
                {this.props.element.name}
            </li>
        );
    }

    private selectElement() {
        this.props.sceneStore.setSelectedObjectId(this.props.element.id);
    }

}
