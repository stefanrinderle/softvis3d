import * as React from "react";
import {observer} from "mobx-react";
import cityBuilderStore from "../../stores/CityBuilderStore";
import SeparatorComponent from "../ui/SeparatorComponent";

/**
 * Bottom bar with infos about the current selected metrics.
 */
@observer
export default class BottomBar extends React.Component<any, any> {

    public render() {
        return (
            <div className="bottom-bar">
                Width: {cityBuilderStore.metricWidth.name}
                <SeparatorComponent/>
                Height: {cityBuilderStore.metricHeight.name}
                <SeparatorComponent/>
                Color: {cityBuilderStore.metricColor.name}
            </div>
        );
    }

}
