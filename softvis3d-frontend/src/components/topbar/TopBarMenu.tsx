import * as React from "react";
import {observer} from "mobx-react";
import cityBuilderStore from "../../stores/CityBuilderStore";

/**
 * Currently used for an example use of selected scene object store.
 */
@observer
export default class TopBarMenu extends React.Component<any, any> {

    public render() {
        return <div className="top-bar-menu">
            <button onClick={this.showSettings.bind(this)}>Settings</button>
        </div>;
    }

    private showSettings() {
        cityBuilderStore.show = true;
    }

}
