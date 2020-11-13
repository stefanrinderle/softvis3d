import {observer} from "mobx-react";
import * as React from "react";
import AppStatusStore from "../stores/AppStatusStore";
import CityBuilderStore from "../stores/CityBuilderStore";
import SceneStore from "../stores/SceneStore";
import CityBuilder from "./citybuilder/CityBuilder";
import Status from "./status/Status";
import Visualization from "./visualization/Visualization";

interface Softvis3DProps {
    appStatusStore: AppStatusStore;
    sceneStore: SceneStore;
    cityBuilderStore: CityBuilderStore;
    baseUrl?: string;
}

@observer
export default class Softvis3D extends React.Component<Softvis3DProps, any> {

    public render() {
        const {appStatusStore, sceneStore, cityBuilderStore, baseUrl} = this.props;
        return (
            <div>
                <Status appStatusStore={appStatusStore}/>
                <CityBuilder store={cityBuilderStore} appStatusStore={appStatusStore} sceneStore={sceneStore} baseUrl={baseUrl}/>
                <Visualization cityBuilderStore={cityBuilderStore} sceneStore={sceneStore} />
            </div>
        );
    }
}
