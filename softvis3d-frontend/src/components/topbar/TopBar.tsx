import * as React from "react";
import {observer} from "mobx-react";
import SelectedElementInfo from "./SelectedElementInfo";
import TopBarMenu from "./TopBarMenu";
import {CityBuilderStore} from "../../stores/CityBuilderStore";
import {SceneStore} from "../../stores/SceneStore";

/**
 * Currently used for an example use of selected scene object store.
 */
@observer
export default class TopBar
        extends React.Component<{ sceneStore: SceneStore; cityBuilderStore: CityBuilderStore}, any> {

    public render() {
        return <div className="top-bar">
            <SelectedElementInfo cityBuilderStore={this.props.cityBuilderStore} sceneStore={this.props.sceneStore}/>
            <TopBarMenu cityBuilderStore={this.props.cityBuilderStore}/>
        </div>;
    }
}
