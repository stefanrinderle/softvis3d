import * as React from "react";
import {observer} from "mobx-react";
import SelectedElementNodeInfo from "./SelectedElementNodeInfo";
import SelectedElementLeafInfo from "./SelectedElementLeafInfo";
import {CityBuilderStore} from "../../stores/CityBuilderStore";

/**
 * Currently used for an example use of selected scene object store.
 */
@observer
export default class SelectedElementInfo
        extends React.Component<{ cityBuilderStore: CityBuilderStore; selectedElement: TreeElement | null}, any> {

    public render() {
        if (this.props.selectedElement !== null) {
            return (
                <div className="selected-element-info">
                    {this.renderSelectedObject(this.props.selectedElement)}
                </div>
            );
        } else {
            return <div className="selected-element-info">Select an object to see the details here</div>;
        }
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
