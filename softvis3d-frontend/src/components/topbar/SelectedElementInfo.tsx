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
            selectedElement.isFile ? "leaf" : "node"
        ];

        return (
            <div>
                <div className={classes.join(" ")}>
                    <span className="element-name">{selectedElement.name}</span>
                    {this.renderButtons(selectedElement.isFile)}
                </div>
            </div>
        );
    }

    private renderButtons(isFile: boolean) {
        if (!isFile) {
            return null;
        }

        return (
            <div className="info-buttons">
                <button id="open-file-button" className="left"
                        onClick={() => { this.openSourceCode(); }}>Open file</button>
                <button id="open-measures-button" className="right"
                        onClick={() => { this.openMeasures(); }}>Open measures</button>
            </div>
        );
    }

    private openSourceCode() {
        if (this.props.sceneStore.selectedElement && this.props.sceneStore.selectedElement.key) {
            this.open("/code", this.props.sceneStore.selectedElement.key);
        }
    }

    private openMeasures() {
        if (this.props.sceneStore.selectedElement && this.props.sceneStore.selectedElement.key) {
            this.open("/component_measures", this.props.sceneStore.selectedElement.key);
        }
    }

    private open(newLocation: string, id: string) {
        let baseUrl: string = (window as any).baseUrl;
        let result = "";
        if (baseUrl) {
            result = baseUrl;
        }
        result = result + newLocation + "?id=" + id;
        window.open(result);
    }
}
