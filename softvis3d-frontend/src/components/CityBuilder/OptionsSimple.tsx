import * as React from "react";
import {observer} from "mobx-react";
import {CityBuilderStore} from "../../stores/CityBuilderStore";
import LayoutPicker from "./LayoutPicker";
import {district, evostreet} from "../../dtos/Layouts";
import * as Profiles from "../../dtos/Profiles";
import PreviewPictureComponent from "./PreviewPicture";
import SelectBoxBuilder from "../ui/SelectBox/SelectBoxBuilder";

const ProfileSelectBox: new() => SelectBoxBuilder<Profile> = SelectBoxBuilder as any;
const MetricSelectBox: new() => SelectBoxBuilder<Metric> = SelectBoxBuilder as any;

@observer
export default class OptionsSimple extends React.Component<{ store: CityBuilderStore; }, any> {
    public render() {

        const profiles = [
            Profiles.demo,
            Profiles.leakPeriod,
            Profiles.custom
        ];

        return (
            <div className="simple">
                <div className="left-column">
                    <ProfileSelectBox
                        label="Profile"
                        className="profiles"
                        value={this.props.store.profile}
                        options={profiles.map((p) => ({key: p.id, label: p.name, value: p}))}
                        onChange={(p: Profile) => { this.props.store.setProfile(p); }}
                    />

                    <MetricSelectBox
                        label="Building Color"
                        className="metric color"
                        value={this.props.store.metricColor}
                        options={this.props.store.availableColorMetrics.map((m) => ({key: m.key, label: m.name, value: m}))}
                        onChange={(m: Metric) => { this.props.store.metricColor = m; }}
                    />

                    <LayoutPicker
                        layouts={[district, evostreet]}
                        store={this.props.store}
                    />

                    <p className="profile-description">
                        {this.props.store.profile.description}
                    </p>
                </div>
                <div className="right-column">
                    <PreviewPictureComponent
                        layout={this.props.store.layoutType}
                        profile={this.props.store.profile}
                    />
                </div>
            </div>
        );
    }
}