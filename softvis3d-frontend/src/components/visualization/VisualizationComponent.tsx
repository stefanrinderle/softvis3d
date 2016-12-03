import * as React from "react";
import {observer} from "mobx-react";
import SceneComponent from "../scene/SceneComponent";
import TopBarComponent from "../topbar/TopBar";

@observer export default class VisualizationComponent extends React.Component<{}, any> {

    public render() {
        return (
            <div>
                <TopBarComponent/>
                <SceneComponent/>
            </div>
        );
    }

}
