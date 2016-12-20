import * as React from "react";
import {observer} from "mobx-react";
import SelectedElementNodeInfo from "./SelectedElementNodeInfo";
import SelectedElementLeafInfo from "./SelectedElementLeafInfo";
import {CityBuilderStore} from "../../stores/CityBuilderStore";

interface SelectedElementInfoProps {
    cityBuilderStore: CityBuilderStore;
    selectedElement: TreeElement | null;
}

@observer
export default class SelectedElementInfo
        extends React.Component<SelectedElementInfoProps, any> {

    public render() {
        return (
            <div className="selected-element-info">
                {this.renderSelectedObject(this.props.selectedElement)}
            </div>
        );
    }

    private renderSelectedObject(selectedElement: TreeElement | null) {
        if (selectedElement === null) {
            return "Select an object to see the details here";
        }

        if (selectedElement.isNode) {
            return <SelectedElementNodeInfo selectedElement={selectedElement}/>;
        } else {
            return <SelectedElementLeafInfo selectedElement={selectedElement}
                                            cityBuilderStore={this.props.cityBuilderStore}/>;
        }
    }

}
