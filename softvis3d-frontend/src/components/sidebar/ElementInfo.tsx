import * as React from "react";
import {SceneStore} from "../../stores/SceneStore";

interface ElementInfoProps {
    element: TreeElement;
    sceneStore: SceneStore;
    isSelected: boolean;
    isOrigin?: boolean;
}

/**
 * Currently used for an example use of selected scene object store.
 */
export default class ElementInfo extends React.Component<ElementInfoProps, any> {
    public static defaultProps = {
        origin: false
    };

    public render() {
        const {element, isSelected, isOrigin} = this.props;
        let classes = [];
        classes.push(element.isNode ? "node" : "leaf");

        if (isOrigin) {
            classes.push("origin");
        }

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
        this.props.sceneStore.setSelectedObjectId(this.props.element.id);
    }

}
