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
            <div>
                <div className={classes.join(" ")}>
                    <span className="element-name">{selectedElement.name}</span>
                    {this.renderButtons(selectedElement.isNode)}
                </div>
            </div>
        );
    }

    private renderButtons(isNode: boolean) {
        if (isNode) {
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

    /**
     * We can be sure that we are currently in the plugin "folder" of the path:
     *
     * Example current url "http://localhost:9000/plugins/resource/de.rinderle.softvis3d%3Asoftvis3d?page=SoftVis3D"
     * Example current url "http://softvis3d.com/sonar/plugins/resource/de.rinderle.softvis3d%3Asoftvis3d?page=SoftVis3D"
     *
     * So we cut of everything starting from "plugin" to be sure that it also works with sub dirs.
     *
     * TODO: Could be added to UrlParameterService.ts after branch "3-direct-visualization-link" is merged.
     */
    private open(newLocation: string, id: string) {
        let href: string = document.location.href;

        let baseLocation: string = href.substr(0, href.indexOf("/plugins"));
        let codeLocation: string = baseLocation + newLocation;

        window.open(codeLocation + "?id=" + id);
    }
}
