import {observer} from "mobx-react";
import * as React from "react";
import CityBuilderStore from "../../stores/CityBuilderStore";
import SceneStore from "../../stores/SceneStore";
import SelectedElementInfo from "./SelectedElementInfo";
import TopBarMenu from "./TopBarMenu";

interface TopBarProbs {
    sceneStore: SceneStore;
    cityBuilderStore: CityBuilderStore;
}

@observer
export default class TopBar extends React.Component<TopBarProbs, any> {

    public render() {
        const {cityBuilderStore, sceneStore} = this.props;
        return (
            <div id="app-topbar" className="top-bar">
                <TopBarMenu cityBuilderStore={cityBuilderStore} sceneStore={sceneStore}/>
                <SelectedElementInfo sceneStore={sceneStore}/>
            </div>
        );
    }

}
