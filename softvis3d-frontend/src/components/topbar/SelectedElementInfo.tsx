import * as React from "react";
import { observer } from "mobx-react";
import { SceneStore } from "../../stores/SceneStore";

interface SelectedElementInfoProps {
    sceneStore: SceneStore;
}

@observer
export default class SelectedElementInfo extends React.Component<SelectedElementInfoProps, any> {

    public render() {
        const selectedElement = this.props.sceneStore.selectedElement;

        if (selectedElement === null) {
            return (
                <div className="selected-element-info">
                    <span className="no-info">Select an object to see the details here</span>
                </div>
            );
        }

        let classes = [
            "selected-element-info",
            selectedElement.isNode ? "node" : "leaf"
        ];

        return (
            <div className={classes.join(" ")}>
                <span className="element-name">{selectedElement.name}</span>
            </div>
        );
    }
}
