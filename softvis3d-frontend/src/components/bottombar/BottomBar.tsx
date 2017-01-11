import * as React from "react";
import { observer } from "mobx-react";
import BottomBarMetricInfo from "./BottomBarMetricInfo";
import { CityBuilderStore } from "../../stores/CityBuilderStore";
import {SceneStore} from "../../stores/SceneStore";
import SelectBoxBuilder from "../ui/SelectBox/SelectBoxBuilder";

interface BottomBarProps {
    cityBuilderStore: CityBuilderStore;
    sceneStore: SceneStore;
}

const MetricSelectBox: new() => SelectBoxBuilder<Metric> = SelectBoxBuilder as any;

/**
 * Bottom bar with information about the current selected metrics.
 */
@observer
export default class BottomBar extends React.Component<BottomBarProps, any> {

    public render() {
        const {cityBuilderStore, sceneStore} = this.props;
        const selectedElement = sceneStore.selectedElement;

        return (
            <div className="bottom-bar">
                <BottomBarMetricInfo title="Width" metric={cityBuilderStore.profile.metricWidth} selectedElement={selectedElement}/>
                <BottomBarMetricInfo title="Height" metric={cityBuilderStore.profile.metricHeight} selectedElement={selectedElement}/>
                <MetricSelectBox
                    label="Color"
                    className="metric-info"
                    value={cityBuilderStore.metricColor}
                    options={cityBuilderStore.getAvailableColorMetrics()}
                    onChange={(m: Metric) => { cityBuilderStore.metricColor = m; }}
                />
            </div>
        );
    }

}
