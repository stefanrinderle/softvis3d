import * as React from "react";
import {observer} from "mobx-react";
import {CityBuilderStore} from "../../stores/CityBuilderStore";

/**
 * Currently used for an example use of selected scene object store.
 */
@observer
export default class TopBarMenu extends React.Component<{ cityBuilderStore: CityBuilderStore}, any> {

    public render() {
        return (
            <div className="top-bar-menu">
                <button onClick={this.showSettings.bind(this)}>Settings</button>
            </div>
        );
    }

    private showSettings() {
        this.props.cityBuilderStore.show = true;
    }

}
