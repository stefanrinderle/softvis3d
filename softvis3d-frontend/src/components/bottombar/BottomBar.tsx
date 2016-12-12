import * as React from "react";
import {observer} from "mobx-react";
import SeparatorComponent from "../ui/SeparatorComponent";
import BottomBarMetricInfo from "./BottomBarMetricInfo";
import {CityBuilderStore} from "../../stores/CityBuilderStore";

/**
 * Bottom bar with infos about the current selected metrics.
 */
@observer
export default class BottomBar extends React.Component<{ cityBuilderStore: CityBuilderStore; }, any> {

    public render() {
        return (
            <div className="bottom-bar">
                <BottomBarMetricInfo title="Width" metric={this.props.cityBuilderStore.metricWidth}/>
                <SeparatorComponent/>
                <BottomBarMetricInfo title="Height" metric={this.props.cityBuilderStore.metricHeight}/>
                <SeparatorComponent/>
                <BottomBarMetricInfo title="Color" metric={this.props.cityBuilderStore.metricColor}/>
            </div>
        );
    }

}
