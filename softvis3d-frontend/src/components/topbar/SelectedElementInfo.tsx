import * as React from "react";
import {observer} from "mobx-react";
import {TreeService} from "../../layout/TreeService";
import SelectedElementNodeInfo from "./SelectedElementNodeInfo";
import SelectedElementLeafInfo from "./SelectedElementLeafInfo";
import {SceneStore} from "../../stores/SceneStore";
import {CityBuilderStore} from "../../stores/CityBuilderStore";

/**
 * Currently used for an example use of selected scene object store.
 */
@observer
export default class SelectedElementInfo
        extends React.Component<{ sceneStore: SceneStore; cityBuilderStore: CityBuilderStore}, any> {

    public render() {
        let selectedElement: TreeElement | null =
            TreeService.searchTreeNode(this.props.sceneStore.legacyData, this.props.sceneStore.selectedObjectId);

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
            return <SelectedElementNodeInfo selectedElement={selectedElement}/>;
        } else {
            return <SelectedElementLeafInfo selectedElement={selectedElement}
                                            cityBuilderStore={this.props.cityBuilderStore}/>;
        }
    }

}
