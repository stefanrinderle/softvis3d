import * as React from "react";
import {observer} from "mobx-react";
import {CityBuilderStore} from "../../stores/CityBuilderStore";
import Category from "../ui/Category";
import SelectBoxBuilder from "../ui/selectbox/SelectBoxBuilder";
import Metric from "../../classes/Metric";
import {custom} from "../../constants/Profiles";
import Scale from "../../classes/Scale";
import {Scales} from "../../constants/Scales";

@observer
export default class OptionsAdvanced extends React.Component<{ store: CityBuilderStore; }, any> {
    public render() {
        return (
            <Category label="Advanced Options" className="advanced" toggle={true} initialVisibility={false}>
                <div className="left-column">
                    <div className="builder-option">
                        <SelectBoxBuilder
                            label="Metric - Footprint"
                            value={this.props.store.profile.footprint}
                            options={this.props.store.genericMetrics.asSelectOptions}
                            onChange={(m: Metric) => {
                                this.props.store.profile = custom;
                                this.props.store.profile.footprint = m;
                            }}
                        />
                    </div>
                    <div className="builder-option">
                    <SelectBoxBuilder
                            label="Metric - Height"
                            value={this.props.store.profile.height}
                            options={this.props.store.genericMetrics.asSelectOptions}
                            onChange={(m: Metric) => {
                                this.props.store.profile = custom;
                                this.props.store.profile.height = m;
                            }}
                        />
                    </div>
                </div>
                <div className="right-column">
                    <div className="builder-option">
                        <SelectBoxBuilder
                            label="Scaling Method"
                            value={this.props.store.profile.scale}
                            options={Scales.availableScales}
                            onChange={(scale: Scale) => {
                                this.props.store.profile.scale = scale;
                            }}
                        />
                    </div>
                    <p className="selection-description profile-description">
                        Change how the metric values will be scaled for footprint and height.
                    </p>
                </div>
            </Category>
        );
    }
}