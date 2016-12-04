import * as React from "react";
import {observer} from "mobx-react";
import sceneStore from "../../stores/SceneStore";
import {TreeService} from "../../layout/TreeService";
import SeparatorComponent from "../ui/SeparatorComponent";
import cityBuilderStore from "../../stores/CityBuilderStore";

/**
 * Currently used for an example use of selected scene object store.
 */
@observer
export default class SelectedElementInfo extends React.Component<any, any> {

    public render() {
        let selectedElement: TreeElement | null =
            TreeService.searchTreeNode(sceneStore.legacyData, sceneStore.selectedObjectId);

        if (selectedElement !== null) {
            return (
                <div className="selected-element-info">
                    {this.renderSelectedObject(selectedElement)}
                </div>
            );
        }

        return <div className="selected-element-info">Select an object to see the details here</div>;
    }

    private renderSelectedObject(selectedElement: TreeElement) {
        if (selectedElement.isNode) {
            return <div>
                Folder: <span className="top-bar-header">{selectedElement.name}</span>
                <SeparatorComponent/>
                <span>Children: {selectedElement.children.length}</span>
            </div>;
        } else {
            return <div>
                <span className="top-bar-header">
                    {selectedElement.name}
                    <SeparatorComponent/>
                </span>
                Height ({cityBuilderStore.metricHeight.name}): {selectedElement.heightMetricValue}
                <SeparatorComponent/>
                Footprint ({cityBuilderStore.metricWidth.name}): {selectedElement.footprintMetricValue}
                <SeparatorComponent/>
                Color ({cityBuilderStore.metricColor.name}): {selectedElement.colorMetricValue}
            </div>;
        }
    }

}
