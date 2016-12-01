import * as React from "react";
import LayoutPicker from "./LayoutPicker";
import PropertyPicker from "./PropertyPicker";
import {district, evostreet} from "../../dtos/Layouts";
import {CityBuilderStore} from "../../stores/CityBuilderStore";
import Category from "../ui/Category";
import {demo, custom} from "../../dtos/Profiles";
import appStatusStore from "../../stores/AppStatusStore";

export default class CityBuilder extends React.Component<{ store: CityBuilderStore; }, any> {

    public render() {
        return (
            <div className="city-builder">

                <Category label={"Building Properties"} className="building">
                    <PropertyPicker
                        profiles={[demo, custom]}
                        store={this.props.store}
                    />
                </Category>

                <Category label={"City Layout"} className="layout">
                    <LayoutPicker
                        layouts={[district, evostreet]}
                        store={this.props.store}
                    />
                </Category>

                <br />
                <hr />
                <br />
                <button onClick={this.fakeLoader}>Fake Loading</button>
                &nbsp;
                <button onClick={this.loadScene.bind(this)}>Load Scene</button>
            </div>
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
        this.props.store.renderButtonClicked = true;
    }
}
