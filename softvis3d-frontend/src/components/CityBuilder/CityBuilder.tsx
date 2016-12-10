import * as React from "react";
import { observer } from "mobx-react";
import { CityBuilderStore } from "../../stores/CityBuilderStore";
import appStatusStore from "../../stores/AppStatusStore";
import sceneStore from "../../stores/SceneStore";
import OptionsSimple from "./OptionsSimple";
import OptionsAdvanced from "./OptionsAdvanced";

@observer export default class CityBuilder extends React.Component<{ store: CityBuilderStore; }, any> {

    public render() {
        return (
            <div className="city-builder">
                <OptionsSimple store={this.props.store} />
                <OptionsAdvanced store={this.props.store} />

                <br /><hr /><br />
                <button onClick={this.fakeLoader.bind(this)}>Fake Loading</button>
                &nbsp;
                <button id="load-scene-button" onClick={this.loadScene.bind(this)}>Load Scene</button>
                &nbsp;
                { this.renderCloseButton() }
            </div>
        );
    }

    private renderCloseButton() {
        if (sceneStore.isVisible) {
            return <button onClick={this.close.bind(this)}>Close</button>;
        }
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

    private close() {
        this.props.store.show = false;
    }
}
