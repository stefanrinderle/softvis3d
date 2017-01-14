import * as React from "react";
import { observer } from "mobx-react";
import MetricKey from "./MetricKey";
import { CityBuilderStore } from "../../../stores/CityBuilderStore";
import {SceneStore} from "../../../stores/SceneStore";
import SelectBoxBuilder from "../../ui/selectbox/SelectBoxBuilder";

interface SceneInformationProps {
    cityBuilderStore: CityBuilderStore;
    sceneStore: SceneStore;
}

const MetricSelectBox: new() => SelectBoxBuilder<Metric> = SelectBoxBuilder as any;

/**
 * Bottom bar with information about the current selected metrics.
 */
@observer
export default class SceneInformation extends React.Component<SceneInformationProps, any> {

    public render() {
        const {cityBuilderStore, sceneStore} = this.props;
        const selectedElement = sceneStore.selectedElement;

        return (
            <div className="scene-information">
                <MetricKey title="Width" metric={cityBuilderStore.profile.metricWidth} selectedElement={selectedElement}/>
                <MetricKey title="Height" metric={cityBuilderStore.profile.metricHeight} selectedElement={selectedElement}/>
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
