import * as React from "react";
import {observer} from "mobx-react";
import {CityBuilderStore} from "../../stores/CityBuilderStore";

/**
 * Currently used for an example use of selected scene object store.
 */
@observer
export default class TopBarMenu extends React.Component<{ cityBuilderStore: CityBuilderStore }, any> {

    public render() {
        return (
            <div className="top-bar-menu">
                <button className="left" onClick={this.showBuilder.bind(this)}>Settings</button>
                <button className="right" onClick={this.showSettings.bind(this)}>Help</button>
            </div>
        );
    }

    private showBuilder() {
        this.props.cityBuilderStore.show = true;
    }

    private showSettings() {
        window.open("http://softvis3d.com/#/details/usage");
    }
}
