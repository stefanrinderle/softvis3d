import * as React from "react";
import { observer } from "mobx-react";
import TopBar from "../topbar/TopBar";
import Scene from "../scene/Scene";
import BottomBar from "../bottombar/BottomBar";
import { CityBuilderStore } from "../../stores/CityBuilderStore";
import { SceneStore } from "../../stores/SceneStore";
import SideBar from "../sidebar/SideBar";
import { TreeService } from "../../layout/TreeService";

interface VisualizationProps {
    sceneStore: SceneStore;
    cityBuilderStore: CityBuilderStore;
}

@observer export default class Visualization extends React.Component<VisualizationProps, any> {
    public render() {
        const {sceneStore} = this.props;

        if (!sceneStore.isVisible) {
            return <div />;
        }

        /* TODO: Move this logic in sceneStore.
         * This logic could also be placed in the store. Not sure for now where to put it.
         * But as the react components should be as dumb as possible i think the store is the better
         * place.
         */
        let selectedElement: TreeElement | null = null;
        if (sceneStore.legacyData !== null && sceneStore.selectedObjectId != null) {
            selectedElement =
                TreeService.searchTreeNode(sceneStore.legacyData, sceneStore.selectedObjectId);
        }

        return (
            <div>
                <TopBar cityBuilderStore={this.props.cityBuilderStore} selectedElement={selectedElement}/>
                <Scene sceneStore={sceneStore}/>
                <BottomBar cityBuilderStore={this.props.cityBuilderStore}/>
                <SideBar
                    sceneStore={sceneStore}
                    selectedElement={selectedElement}
                />
            </div>
        );
    }

}
