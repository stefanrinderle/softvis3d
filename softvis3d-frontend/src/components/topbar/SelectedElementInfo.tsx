import * as React from "react";
import { observer } from "mobx-react";
import { CityBuilderStore } from "../../stores/CityBuilderStore";
import SelectedElementMetricInfo from "./SelectedElementMetricInfo";

interface SelectedElementInfoProps {
    cityBuilderStore: CityBuilderStore;
    selectedElement: TreeElement | null;
}

@observer export default class SelectedElementInfo extends React.Component<SelectedElementInfoProps, any> {

    public render() {
        const {selectedElement, cityBuilderStore} = this.props;

        if (selectedElement === null) {
            return (
                <div className="selected-element-info">
                    <span className="no-info">Select an object to see the details here</span>
                </div>
            );
        }

        let classes = [
            "selected-element-info",
            selectedElement.isNode ? "node" : "leaf"
        ];

        return (
            <div className={classes.join(" ")}>
                <span className="element-name">{selectedElement.name}</span>
                {this.renderObjectInformation(selectedElement, cityBuilderStore)}
            </div>
        );
    }

    private renderObjectInformation(element: TreeElement, store: CityBuilderStore) {
        if (element.isNode) {
            return <SelectedElementMetricInfo title="Content" name="Elements" value={element.children.length}/>;
        } else {
            return [
                <SelectedElementMetricInfo
                    key="metric-height"
                    title="Height"
                    name={store.metricHeight.name}
                    value={element.measures[store.metricHeight.key]}
                />,
                <SelectedElementMetricInfo
                    key="metric-footprint"
                    title="Footprint"
                    name={store.metricWidth.name}
                    value={element.measures[store.metricWidth.key]}
                />,
                <SelectedElementMetricInfo
                    key="metric-color"
                    title="Color"
                    name={store.metricColor.name}
                    value={element.measures[store.metricColor.key]}
                />
            ];
        }
    }
}
