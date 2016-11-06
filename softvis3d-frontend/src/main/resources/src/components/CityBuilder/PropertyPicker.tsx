import * as React from "react";
import {observer} from "mobx-react";
import {SelectBox, SelectOption} from "../ui/SelectBox";
import {CityBuilderConfig} from "../../stores/CityBuilder";
import Profile from "../../classes/Profile";

export interface PropertyPickerProps {
    profiles: Array<Profile>;
    store: CityBuilderConfig;
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
            <div>
                <p>
                    Profile<br />
                    <SelectBox
                        onChange={this.handelProfileChange.bind(this)}
                        value={this.props.store.profile}
                    >
                        {this.createOptionsFromProfiles()}
                    </SelectBox>
                </p>

                <p>
                    {this.renderMetricDropdown("Metric - Height", "metricHeight")}
                    <br />
                    {this.renderMetricDropdown("Metric - Base / Width", "metricWidth")}
                    <br />
                    {this.renderMetricDropdown("Metric - Color", "metricColor")}
                </p>

                <p>
                    {this.props.store.profile.description}
                </p>
            </div>
        );
    }

    private createOptionsFromProfiles() {
        return this.props.profiles
            .map(p => <SelectOption
                key={p.id}
                value={p}
                label={p.name}
            />);
    }

    private createOptionsFromLoadedMetrics() {
        return this.props.store.availableMetrics
            .map(metric => <SelectOption
                key={metric.id}
                value={metric.key}
                label={metric.name}
                disabled={!this.props.store.profile.editable}
            />);
    }

    private renderMetricDropdown(label: string, type: metricType) {
        return (
            <div>
                <div>{label}</div>
                <SelectBox
                    onChange={this.handelChange.bind(this, type)}
                    value={(this.props.store as any)[type] as string}
                >
                    {this.createOptionsFromLoadedMetrics()}
                </SelectBox>
            </div>
        );
    }
}