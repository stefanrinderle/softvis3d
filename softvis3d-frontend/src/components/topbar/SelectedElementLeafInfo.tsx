import * as React from "react";
import {observer} from "mobx-react";
import SeparatorComponent from "../ui/SeparatorComponent";
import SelectedElementMetricInfo from "./SelectedElementMetricInfo";
import {CityBuilderStore} from "../../stores/CityBuilderStore";

/**
 * Currently used for an example use of selected scene object store.
 */
@observer
export default class SelectedElementLeafInfo
        extends React.Component<{ selectedElement: TreeElement; cityBuilderStore: CityBuilderStore}, any> {

    public render() {
        return <div>
            <span className="top-bar-header">
                {this.props.selectedElement.name}
                <SeparatorComponent/>
            </span>
            <SelectedElementMetricInfo title="Height" name={this.props.cityBuilderStore.metricHeight.name}
                                       value={this.props.selectedElement.heightMetricValue}/>
            <SeparatorComponent/>
            <SelectedElementMetricInfo title="Footprint" name={this.props.cityBuilderStore.metricWidth.name}
                                       value={this.props.selectedElement.footprintMetricValue}/>
            <SeparatorComponent/>
            <SelectedElementMetricInfo title="Color" name={this.props.cityBuilderStore.metricColor.name}
                                       value={this.props.selectedElement.colorMetricValue}/>
        </div>;
    }

}
