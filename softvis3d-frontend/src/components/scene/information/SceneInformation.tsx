import * as React from "react";
import { observer } from "mobx-react";
import CityBuilderStore from "../../../stores/CityBuilderStore";
import MetricKey from "./MetricKey";
import SceneStore from "../../../stores/SceneStore";
import SelectBoxBuilder from "../../ui/selectbox/SelectBoxBuilder";
import { ColorMetrics } from "../../../constants/Metrics";
import MetricSet from "../../../classes/MetricSet";
import Metric from "../../../classes/Metric";

interface SceneInformationProps {
    sceneStore: SceneStore;
    cityBuilderStore: CityBuilderStore;
}

/**
 * Bottom bar with information about the current selected metrics.
 */
@observer
export default class SceneInformation extends React.Component<SceneInformationProps, any> {

    public render() {
        const {sceneStore, cityBuilderStore} = this.props;
        const selectedElement = sceneStore.selectedElement;

        return (
            <div className="scene-information">
                <MetricKey title="Footprint"
                           metric={cityBuilderStore.options.profile.footprintMetric}
                           selectedElement={selectedElement}/>
                <MetricKey title="Height"
                           metric={cityBuilderStore.options.profile.heightMetric}
                           selectedElement={selectedElement}/>
                <SelectBoxBuilder
                    label="Color"
                    className="metric-info"
                    value={cityBuilderStore.options.metricColor}
                    options={new MetricSet(ColorMetrics.availableColorMetrics).asSelectOptions}
                    onChange={(m: Metric) => { cityBuilderStore.options.metricColor = m; }}
                    append={this.renderColorInformation()}
                />
            </div>
        );
    }

    private renderColorInformation(): JSX.Element[] {
        const colorValue = this.props.sceneStore.getColorValue(this.props.cityBuilderStore.options.metricColor);
        const colorInformation: JSX.Element[] = [];
        if (colorValue !== null) {
            colorInformation.push(<span className="value">{colorValue}</span>);
        }
        return colorInformation;
    }
}
