import * as React from "react";
import { observer } from "mobx-react";
import { CityBuilderStore } from "../../stores/CityBuilderStore";
import LayoutPicker from "./LayoutPicker";
import { Layouts } from "../../constants/Layouts";
import PreviewPictureComponent from "./PreviewPictureComponent";
import SelectBoxBuilder from "../ui/selectbox/SelectBoxBuilder";
import Profile from "../../classes/Profile";
import { Profiles } from "../../constants/Profiles";
import Metric from "../../classes/Metric";

export interface OptionsSimpleProps {
    store: CityBuilderStore;
    baseUrl?: string;
}

@observer
export default class OptionsSimple extends React.Component<OptionsSimpleProps, any> {
    public render() {

        return (
            <div className="simple">
                <div className="left-column">
                    <div className="builder-option">
                        <SelectBoxBuilder
                            label="Profile"
                            className="profiles"
                            value={this.props.store.profile}
                            options={Profiles.availableProfiles}
                            onChange={(p: Profile) => { this.props.store.profile = p; }}
                        />
                        <p className="selection-description profile-description">
                            {this.props.store.profile.description}
                        </p>
                    </div>
                    <div className="builder-option">
                        <SelectBoxBuilder
                            label="Building Color"
                            className="metric color"
                            value={this.props.store.metricColor}
                            options={this.props.store.colorMetrics.asSelectOptions}
                            onChange={(m: Metric) => { this.props.store.metricColor = m; }}
                        />
                        <p className="selection-description color-description">
                            { this.props.store.metricColor.description }
                        </p>
                    </div>

                    <div className="builder-option">
                        <span>Layout</span>
                        <LayoutPicker
                            layouts={Layouts.availableLayouts}
                            store={this.props.store}
                        />
                        <p className="selection-description layout-description">
                            {this.props.store.layout.description}
                        </p>
                    </div>
                </div>
                <div className="right-column">
                    <PreviewPictureComponent store={this.props.store} baseUrl={this.props.baseUrl}/>
                </div>
            </div>
        );
    }
}