import * as React from "react";
import {observer} from "mobx-react";
import {CityBuilderStore} from "../../stores/CityBuilderStore";
import Category from "../ui/Category";
import SelectBoxBuilder from "../ui/selectbox/SelectBoxBuilder";
import LayoutProcessor from "../../legacy/LayoutProcessor";
import Metric from "../../constants/Metric";

@observer
export default class OptionsAdvanced extends React.Component<{ store: CityBuilderStore; }, any> {
    public render() {
        return (
            <Category label="Advanced Options" className="advanced" toggle={true} initialVisibility={false}>
                <div className="left-column">
                    <div className="builder-option">
                        <SelectBoxBuilder
                            label="Metric - Base"
                            value={this.props.store.profile.metricWidth}
                            options={this.props.store.getAvailableGenericMetrics()}
                            onChange={(m: Metric) => {
                                this.props.store.chooseEditableProfile();
                                this.props.store.profile.metricWidth = m;
                            }}
                        />
                    </div>
                    <div className="builder-option">
                    <SelectBoxBuilder
                            label="Metric - Height"
                            value={this.props.store.profile.metricHeight}
                            options={this.props.store.getAvailableGenericMetrics()}
                            onChange={(m: Metric) => {
                                this.props.store.chooseEditableProfile();
                                this.props.store.profile.metricHeight = m;
                            }}
                        />
                    </div>
                </div>
                <div className="right-column">
                    <div className="builder-option">
                        <SelectBoxBuilder
                            label="Scaling Method"
                            value={this.props.store.profile.scale}
                            options={LayoutProcessor.SCALING_METHODS}
                            onChange={(scale) => {
                                this.props.store.chooseEditableProfile();
                                this.props.store.profile.scale = scale;
                            }}
                        />
                    </div>
                </div>
            </Category>
        );
    }
}