import * as React from "react";
import {observer} from "mobx-react";
import SelectedElementInfo from "./SelectedElementInfo";
import TopBarMenu from "./TopBarMenu";
import {CityBuilderStore} from "../../stores/CityBuilderStore";
import {SceneStore} from "../../stores/SceneStore";
import VisualizationLinkService from "../../services/VisualizationLinkService";

interface TopBarProbs {
    sceneStore: SceneStore;
    cityBuilderStore: CityBuilderStore;
    visualizationLinkService: VisualizationLinkService;
}

@observer
export default class TopBar extends React.Component<TopBarProbs, any> {

    public render() {
        const {cityBuilderStore, sceneStore, visualizationLinkService} = this.props;
        return (
            <div id="app-topbar" className="top-bar">
                <TopBarMenu cityBuilderStore={cityBuilderStore} visualizationLinkService={visualizationLinkService}/>
                <SelectedElementInfo sceneStore={sceneStore}/>
            </div>
        );
    }

}
