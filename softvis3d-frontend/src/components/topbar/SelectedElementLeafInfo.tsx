import * as React from "react";
import {observer} from "mobx-react";
import SelectedElementMetricInfo from "./SelectedElementMetricInfo";
import {CityBuilderStore} from "../../stores/CityBuilderStore";

interface SelectedElementLeafInfoProps {
    selectedElement: TreeElement;
    cityBuilderStore: CityBuilderStore;
}

@observer export default class SelectedElementLeafInfo extends React.Component<SelectedElementLeafInfoProps, any> {

    public render() {
        const {cityBuilderStore, selectedElement} = this.props;

        return(
            <div>
                <span className="top-bar-header">
                    {selectedElement.name}
                </span>
                <SelectedElementMetricInfo title="Height" name={cityBuilderStore.metricHeight.name}
                                           value={selectedElement.heightMetricValue}/>
                <SelectedElementMetricInfo title="Footprint" name={cityBuilderStore.metricWidth.name}
                                           value={selectedElement.footprintMetricValue}/>
                <SelectedElementMetricInfo title="Color" name={cityBuilderStore.metricColor.name}
                                           value={selectedElement.colorMetricValue}/>
            </div>
        );
    }

}
