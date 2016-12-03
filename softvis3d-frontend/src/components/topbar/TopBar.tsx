import * as React from "react";
import {observer} from "mobx-react";
import sceneStore from "../../stores/SceneStore";
import {TreeService} from "../../layout/TreeService";

/**
 * Currently used for an example use of selected scene object store.
 */
@observer
export default class TopBarComponent extends React.Component<any, any> {

    public render() {
        let selectedElement: TreeElement | null =
            TreeService.searchTreeNode(sceneStore.legacyData, sceneStore.selectedObjectId);

        if (selectedElement !== null) {
            return (
                <div className="top-bar">
                    <div>
                        {this.renderSelectedObject(selectedElement)}
                    </div>
                </div>
            );
        }

        return <div/>;
    }

    private renderSelectedObject(selectedElement: TreeElement) {
        if (selectedElement.isNode) {
            return <div>
                <span>{selectedElement.name}</span>
                {this.renderSeperator()}
                <span>Children: {selectedElement.children.length}</span>
            </div>;
        } else {
            return <div>
                <span>{selectedElement.name}</span>
                {this.renderSeperator()}
                <span>Height: {selectedElement.heightMetricValue}</span>
                {this.renderSeperator()}
                <span>Footprint: {selectedElement.footprintMetricValue}</span>
                {this.renderSeperator()}
                <span>Color: {selectedElement.colorMetricValue}</span>
            </div>;
        }
    }

    private renderSeperator() {
        return <span> | </span>;
    }
}
