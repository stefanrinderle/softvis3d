import * as React from "react";
import {observer} from "mobx-react";
import CityBuilder from "./citybuilder/CityBuilder";
import {AppStatusStore} from "../stores/AppStatusStore";
import {CityBuilderStore} from "../stores/CityBuilderStore";
import {SceneStore} from "../stores/SceneStore";
import Visualization from "./visualization/Visualization";
import Status from "./status/Status";
import VisualizationLinkService from "../services/VisualizationLinkService";
import { ObjectFactory } from "./scene/visualization/objects/ObjectFactory";

interface Softvis3DProps {
    appStatusStore: AppStatusStore;
    sceneStore: SceneStore;
    cityBuilderStore: CityBuilderStore;
    visualizationLinkService: VisualizationLinkService;
    baseUrl?: string;
}

@observer
export default class Softvis3D extends React.Component<Softvis3DProps, any> {

    public render() {
        ObjectFactory.loadFonts();

        const {appStatusStore, sceneStore, cityBuilderStore, visualizationLinkService, baseUrl} = this.props;
        return (
            <div>
                <Status appStatusStore={appStatusStore}/>
                <CityBuilder store={cityBuilderStore} appStatusStore={appStatusStore} baseUrl={baseUrl}/>
                <Visualization cityBuilderStore={cityBuilderStore} sceneStore={sceneStore}
                               visualizationLinkService={visualizationLinkService}/>
            </div>
        );
    }
}
