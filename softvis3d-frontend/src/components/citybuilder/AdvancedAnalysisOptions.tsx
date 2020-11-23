import {observer} from "mobx-react";
import * as React from "react";
import BuildingColorTheme from "../../classes/BuildingColorTheme";
import Layout from "../../classes/Layout";
import Metric from "../../classes/Metric";
import Scale from "../../classes/Scale";
import {SceneColorTheme} from "../../classes/SceneColorTheme";
import {BuildingColorThemes} from "../../constants/BuildingColorThemes";
import {Layouts} from "../../constants/Layouts";
import {custom} from "../../constants/Profiles";
import {Scales} from "../../constants/Scales";
import {SceneColorThemes} from "../../constants/SceneColorThemes";
import CityBuilderStore from "../../stores/CityBuilderStore";
import Category from "../ui/Category";
import SelectBoxBuilder from "../ui/selectbox/SelectBoxBuilder";

@observer
export default class AdvancedAnalysisOptions extends React.Component<{ store: CityBuilderStore; }, any> {
    public render() {

        const {footprintMetric, heightMetric, options} = this.props.store;

        return (
            <div>
                <Category label="Metrics" className="advanced" toggle={false} initialVisibility={true}>
                    <div className="left-column">
                        <div className="builder-option">
                            <SelectBoxBuilder
                                label="Metric - Footprint"
                                value={footprintMetric}
                                options={this.props.store.genericMetrics.asSelectOptions}
                                onChange={(m: Metric) => {
                                    this.props.store.setProfile(custom);
                                    this.props.store.options.profile.footprintMetric = m;
                                }}
                            />
                            <p className="selection-description">{footprintMetric.description}</p>
                        </div>
                    </div>
                    <div className="middle-column">
                        <div className="builder-option">
                            <SelectBoxBuilder
                                label="Metric - Height"
                                value={heightMetric}
                                options={this.props.store.genericMetrics.asSelectOptions}
                                onChange={(m: Metric) => {
                                    this.props.store.setProfile(custom);
                                    this.props.store.options.profile.heightMetric = m;
                                }}
                            />
                            <p className="selection-description">{heightMetric.description}</p>
                        </div>
                    </div>
                    <div className="right-column">
                        <div className="builder-option">
                            <SelectBoxBuilder
                                label="Building color metric"
                                className="metric color"
                                value={options.metricColor}
                                options={this.props.store.colorMetrics.asSelectOptions}
                                onChange={(m: any) => {
                                    options.metricColor = (m as Metric);
                                }}
                            />
                            <p className="selection-description color-description">
                                {options.metricColor.description}
                            </p>
                        </div>
                    </div>
                </Category>
                <Category label="Color themes" className="advanced" toggle={false} initialVisibility={true}>
                    <div className="left-column">
                        <div className="builder-option">
                            <div className="builder-option">
                                <SelectBoxBuilder
                                    label="Base color theme"
                                    value={options.colorTheme}
                                    options={SceneColorThemes.availableColorThemes}
                                    onChange={(colorTheme: SceneColorTheme) => {
                                        options.colorTheme = colorTheme;
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="middle-column">
                        <div className="builder-option">
                            <SelectBoxBuilder
                                label="Building color theme"
                                value={options.buildingColorTheme}
                                options={BuildingColorThemes.availableBuildingColorThemes}
                                onChange={(buildingColorTheme: BuildingColorTheme) => {
                                    options.buildingColorTheme = buildingColorTheme;
                                }}
                            />
                        </div>
                    </div>
                </Category>
                <Category label="Layout" className="advanced" toggle={false} initialVisibility={true}>
                    <div className="left-column">
                        <div className="builder-option">
                            <div className="builder-option">
                                <SelectBoxBuilder
                                    label="Layout"
                                    value={options.layout}
                                    options={Layouts.availableLayouts}
                                    onChange={(layout: Layout) => {
                                        options.layout = layout;
                                    }}
                                />
                                <p className="selection-description">{options.layout.description}</p>
                            </div>
                        </div>
                    </div>
                    <div className="middle-column">
                        <div className="builder-option">
                            <SelectBoxBuilder
                                label="Scaling Method"
                                value={this.props.store.options.profile.scale}
                                options={Scales.availableScales}
                                onChange={(scale: Scale) => {
                                    this.props.store.options.profile.scale = scale;
                                }}
                            />
                            <p className="selection-description">{this.props.store.options.profile.scale.description}</p>
                        </div>
                    </div>
                </Category>
            </div>
        );
    }
}