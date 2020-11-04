import {observer} from "mobx-react";
import * as React from "react";
import BuildingColorTheme from "../../classes/BuildingColorTheme";
import Metric from "../../classes/Metric";
import Scale from "../../classes/Scale";
import {BuildingColorThemes} from "../../constants/BuildingColorThemes";
import {custom} from "../../constants/Profiles";
import {Scales} from "../../constants/Scales";
import {CityBuilderStore} from "../../stores/CityBuilderStore";
import Category from "../ui/Category";
import SelectBoxBuilder from "../ui/selectbox/SelectBoxBuilder";

@observer
export default class OptionsAdvanced extends React.Component<{ store: CityBuilderStore; }, any> {
    public render() {

        const {footprintMetric, heightMetric} = this.props.store;

        return (
            <Category label="Advanced Options" className="advanced" toggle={true} initialVisibility={false}>
                <div className="left-column">
                    <div className="builder-option">
                        <SelectBoxBuilder
                            label="Metric - Footprint"
                            value={footprintMetric}
                            options={this.props.store.genericMetrics.asSelectOptions}
                            onChange={(m: Metric) => {
                                this.props.store.profile = custom;
                                this.props.store.profile.footprintMetricId = m.id;
                            }}
                        />
                        <p className="selection-description">{ footprintMetric.description }</p>
                    </div>
                </div>
                <div className="middle-column">
                    <div className="builder-option">
                        <SelectBoxBuilder
                            label="Metric - Height"
                            value={heightMetric}
                            options={this.props.store.genericMetrics.asSelectOptions}
                            onChange={(m: Metric) => {
                                this.props.store.profile = custom;
                                this.props.store.profile.heightMetricId = m.id;
                            }}
                        />
                        <p className="selection-description">{ heightMetric.description }</p>
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
                        <p className="selection-description">{ this.props.store.profile.scale.description }</p>
                    </div>
                </div>
                <br />
                <div className="left-column">
                    <div className="builder-option">
                        <SelectBoxBuilder
                            label="Building color theme"
                            value={this.props.store.buildingColorTheme}
                            options={BuildingColorThemes.availableBuildingColorThemes}
                            onChange={(buildingColorTheme: BuildingColorTheme) => {
                                this.props.store.buildingColorTheme = buildingColorTheme;
                            }}
                        />
                        <p className="selection-description">{ this.props.store.buildingColorTheme.description }</p>
                    </div>
                </div>
            </Category>
        );
    }
}