import * as React from "react";
import {observer} from "mobx-react";
import {CityBuilderStore} from "../../stores/CityBuilderStore";
import LayoutPicker from "./LayoutPicker";
import {district, evostreet} from "../../constants/Layouts";
import * as Profiles from "../../constants/Profiles";
import PreviewPictureComponent from "./PreviewPictureComponent";
import SelectBoxBuilder from "../ui/selectbox/SelectBoxBuilder";
import Metric from "../../classes/Metric";
import Profile from "../../classes/Profile";

@observer
export default class OptionsSimple extends React.Component<{ store: CityBuilderStore; }, any> {
    public render() {

        const profiles = [
            Profiles.defaultProfile,
            Profiles.leakPeriod,
            Profiles.duplicatedLinesOfCode,
            Profiles.custom
        ];

        return (
            <div className="simple">
                <div className="left-column">
                    <div className="builder-option">
                        <SelectBoxBuilder
                            label="Profile"
                            className="profiles"
                            value={this.props.store.profile}
                            options={profiles}
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
                            The building color can be changed dynamically in the view using the combo box in the bottom bar.
                        </p>
                    </div>

                    <div className="builder-option">
                        <span>Layout</span>
                        <LayoutPicker
                            layouts={[district, evostreet]}
                            store={this.props.store}
                        />
                        <p className="selection-description layout-description">
                            {this.props.store.layout.description}
                        </p>
                    </div>
                </div>
                <div className="right-column">
                    <PreviewPictureComponent store={this.props.store}/>
                </div>
            </div>
        );
    }
}