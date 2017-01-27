import * as React from "react";
import {observer} from "mobx-react";
import CityBuilder from "./citybuilder/CityBuilder";
import {AppStatusStore} from "../stores/AppStatusStore";
import {CityBuilderStore} from "../stores/CityBuilderStore";
import {SceneStore} from "../stores/SceneStore";
import Visualization from "./visualization/Visualization";
import Status from "./status/Status";

interface Softvis3DProps {
    appStatusStore: AppStatusStore;
    sceneStore: SceneStore;
    cityBuilderStore: CityBuilderStore;
}

@observer
export default class Softvis3D extends React.Component<Softvis3DProps, any> {

    public render() {
        const {appStatusStore, sceneStore, cityBuilderStore} = this.props;
        return (
            <div>
                <Status appStatusStore={appStatusStore}/>
                <CityBuilder store={cityBuilderStore} appStatusStore={appStatusStore}/>
                <Visualization cityBuilderStore={cityBuilderStore} sceneStore={sceneStore}/>
            </div>
        );
    }
}
