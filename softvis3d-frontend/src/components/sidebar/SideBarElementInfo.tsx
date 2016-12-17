import * as React from "react";
import {SceneStore} from "../../stores/SceneStore";

interface SideBarElementInfoProps {
    element: TreeElement;
    selected?: boolean;
    origin?: boolean;
    sceneStore: SceneStore;
}

/**
 * Currently used for an example use of selected scene object store.
 */
export default class SideBarElementInfo extends React.Component<SideBarElementInfoProps, any> {
    public static defaultProps = {
        selected: false,
        origin: false
    };

    public render() {
        const {element, selected, origin} = this.props;
        let classes = [];
        classes.push(element.isNode ? "node" : "leaf");

        if (origin) {
            classes.push("origin");
        }

        if (selected) {
            classes.push("current-selected");
        }

        return (
            <li key={element.id} className={classes.join(" ")} onClick={() => selected || this.selectElement()}>
                {this.props.element.name}
            </li>
        );
    }

    private selectElement() {
        this.props.sceneStore.setSelectedObjectId(this.props.element.id);
    }

}
