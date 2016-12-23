import * as React from "react";
import { observer } from "mobx-react";
import { CityBuilderStore } from "../../stores/CityBuilderStore";
import sceneStore from "../../stores/SceneStore";
import OptionsSimple from "./OptionsSimple";
import OptionsAdvanced from "./OptionsAdvanced";

@observer export default class CityBuilder extends React.Component<{ store: CityBuilderStore; }, any> {

    public render() {
        if (!this.props.store.isVisible) {
            return <div />;
        }

        return (
            <div className="city-builder">
                <OptionsSimple store={this.props.store} />
                <OptionsAdvanced store={this.props.store} />

                <div className="buttons">
                    <button id="load-scene-button" onClick={() => this.loadScene()}>Load Scene</button>
                    { this.renderCloseButton() }
                </div>
            </div>
        );
    }

    private renderCloseButton() {
        if (sceneStore.isVisible) {
            return <button onClick={() => this.close()}>Close</button>;
        }
    }

    private loadScene() {
        this.props.store.show = false;
        this.props.store.renderButtonClicked = true;
    }

    private close() {
        this.props.store.show = false;
    }
}
