import * as React from "react";
import {SceneStore} from "../../stores/SceneStore";
import {TreeElement} from "../../classes/TreeElement";

interface ElementInfoProps {
    element: TreeElement;
    sceneStore: SceneStore;
    isSelected: boolean;
}

/**
 * Currently used for an example use of selected scene object store.
 */
export default class FolderContentElement extends React.Component<ElementInfoProps, any> {

    public render() {
        const {element, isSelected} = this.props;
        let classes = [];
        classes.push(element.isFile ? "leaf" : "node");

        if (isSelected) {
            classes.push("current-selected");
        }

        return (
            <li key={element.id} className={classes.join(" ")} onClick={() => isSelected || this.selectElement()}>
                {this.props.element.name}
            </li>
        );
    }

    private selectElement() {
        this.props.sceneStore.selectedObjectId = this.props.element.id;
    }

}
