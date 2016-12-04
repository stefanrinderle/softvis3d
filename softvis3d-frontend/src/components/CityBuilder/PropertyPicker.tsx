import * as React from "react";
import {observer} from "mobx-react";
import {SelectBox, SelectOption} from "../ui/SelectBox";
import {CityBuilderStore} from "../../stores/CityBuilderStore";
import {custom} from "../../dtos/Profiles";

export interface PropertyPickerProps {
    profiles: Profile[];
    store: CityBuilderStore;
}

declare type metricType = "metricHeight" | "metricColor" | "metricWidth";

@observer export default class PropertyPicker extends React.Component<PropertyPickerProps, any> {
    public handelChange(metricKey: metricType, key: string) {
        (this.props.store as any)[metricKey] = key;
    }

    public handelProfileChange(p: Profile) {
        this.props.store.setProfile(p);
    }

    public render() {
        return (
            <div className="property-component">
                <div className="metrics">
                    {this.renderMetricDropdown("Metric - Height", "metricHeight")}
                    {this.renderMetricDropdown("Metric - Base / Width", "metricWidth")}
                    {this.renderMetricDropdown("Metric - Color", "metricColor")}
                </div>
            </div>
        );
    }

    private renderMetricDropdown(label: string, type: metricType) {
        return (
            <SelectBox
                label={label}
                onMouseDown={this.chooseEditableProfile.bind(this)}
                onChange={this.handelChange.bind(this, type)}
                value={(this.props.store as any)[type] as string}
            >
                {this.createOptionsFromLoadedMetrics()}
            </SelectBox>
        );
    }

    private createOptionsFromLoadedMetrics() {
        return this.props.store.availableMetrics
            .map((metric) => <SelectOption
                key={metric.key}
                value={metric.key}
                label={metric.name}
                disabled={!this.props.store.profile.editable}
            />);
    }

    private chooseEditableProfile() {
        this.props.store.setProfile(custom);
    }
}