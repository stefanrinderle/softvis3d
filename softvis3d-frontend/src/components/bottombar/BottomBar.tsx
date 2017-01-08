import * as React from "react";
import { observer } from "mobx-react";
import BottomBarMetricInfo from "./BottomBarMetricInfo";
import { CityBuilderStore } from "../../stores/CityBuilderStore";
import SelectBoxBuilder from "../ui/SelectBox/SelectBoxBuilder";

const MetricSelectBox: new() => SelectBoxBuilder<Metric> = SelectBoxBuilder as any;

/**
 * Bottom bar with infos about the current selected metrics.
 */
@observer
export default class BottomBar extends React.Component<{ cityBuilderStore: CityBuilderStore; }, any> {

    public render() {
        return (
            <div className="bottom-bar">
                <BottomBarMetricInfo title="Width" metric={this.props.cityBuilderStore.metricWidth}/>
                <BottomBarMetricInfo title="Height" metric={this.props.cityBuilderStore.metricHeight}/>
                <MetricSelectBox
                    label="Building Color"
                    className="metric color"
                    value={this.props.cityBuilderStore.metricColor}
                    options={this.props.cityBuilderStore.availableColorMetrics
                                .map((m) => ({key: m.key, label: m.name, value: m}))}
                    onChange={(m: Metric) => { this.props.cityBuilderStore.metricColor = m; }}
                />
            </div>
        );
    }

}
