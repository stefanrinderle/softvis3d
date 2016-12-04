import * as React from "react";
import {observer} from "mobx-react";
import TopBar from "../topbar/TopBar";
import Scene from "../scene/Scene";
import BottomBar from "../bottombar/BottomBar";

@observer export default class VisualizationComponent extends React.Component<{}, any> {

    public render() {
        return (
            <div>
                <TopBar/>
                <Scene/>
                <BottomBar/>
            </div>
        );
    }

}
