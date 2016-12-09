import * as React from "react";
import {observer} from "mobx-react";
import {CityBuilderStore} from "../../stores/CityBuilderStore";
import LayoutPicker from "./LayoutPicker";
import {district, evostreet} from "../../dtos/Layouts";
import * as Profiles from "../../dtos/Profiles";
import PreviewPictureComponent from "./PreviewPicture";
import {SelectBox, SelectOption} from "../ui/SelectBox";

@observer export default class OptionsSimple extends React.Component<{ store: CityBuilderStore; }, any> {
    public render() {

        const profiles = [
            Profiles.demo,
            Profiles.leakPeriod,
            Profiles.custom
        ];

        return (
            <div className="simple">
                <div className="left-column">
                    <SelectBox
                        label="Profile"
                        className={"profiles"}
                        onChange={(p: Profile) => this.props.store.setProfile(p)}
                        value={this.props.store.profile}
                    >
                        {profiles.map((p) => <SelectOption key={p.id} value={p} label={p.name} />)}
                    </SelectBox>

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