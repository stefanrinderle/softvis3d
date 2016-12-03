import * as React from "react";
import LayoutPicker from "./LayoutPicker";
import PropertyPicker from "./PropertyPicker";
import {district, evostreet} from "../../dtos/Layouts";
import {CityBuilderStore} from "../../stores/CityBuilderStore";
import Category from "../ui/Category";
import {demo, custom} from "../../dtos/Profiles";
import appStatusStore from "../../stores/AppStatusStore";
import PreviewPictureComponent from "./PreviewPicture";
import {observer} from "mobx-react";
import {SelectBox, SelectOption} from "../ui/SelectBox";
// import PreviewPictureComponent from "./PreviewPicture";

@observer export default class CityBuilder extends React.Component<{ store: CityBuilderStore; }, any> {

    public render() {
        return (
            <div className="city-builder">
                { this.renderSimpleOptions() }
                { this.renderAdvancedOptions() }

                <br /><hr /><br />
                <button onClick={this.fakeLoader}>Fake Loading</button>
                &nbsp;
                <button onClick={this.loadScene.bind(this)}>Load Scene</button>
            </div>
        );
    }

    private renderSimpleOptions() {
        return (
            <div className="simple">
                <div className="left-column">
                    {this.renderProfiler()}

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

    private renderAdvancedOptions() {
        return (
            <Category label={"Advanced Properties"} className="advanced">
                <PropertyPicker
                    profiles={[demo, custom]}
                    store={this.props.store}
                />
            </Category>
        );
    }

    private renderProfiler() {
        const profiles = [demo, custom].map((p) => <SelectOption key={p.id} value={p} label={p.name} />
        );

        return (
            <SelectBox
                label="Profile"
                className={"profiles"}
                onChange={(p: Profile) => this.props.store.setProfile(p)}
                value={this.props.store.profile}
            >
                {profiles}
            </SelectBox>
        );
    }

    private fakeLoader() {
        appStatusStore.load("DUMMY");
        appStatusStore.load("DUMMY");
        appStatusStore.load("DUMMY");

        window.setTimeout(
            () => { appStatusStore.loadComplete("DUMMY"); },
            1000
        );
        window.setTimeout(
            () => { appStatusStore.loadComplete("DUMMY"); },
            2000
        );
        window.setTimeout(
            () => { appStatusStore.loadComplete("DUMMY"); },
            3500
        );
    }

    private loadScene() {
        this.props.store.show = false;
        this.props.store.renderButtonClicked = true;
    }
}
