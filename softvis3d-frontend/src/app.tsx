import * as React from "react";
import * as ReactDOM from "react-dom";
import CityBuilder from "./components/CityBuilder";
import cityBuilderConfig from "./stores/CityBuilder";
import * as Actions from "./actions/softvisActions";
import dispatcher from "./dispatcher";
import { SonarQubeStore } from "./events/sonarqube";
import SceneComponent from "./components/scene/SceneComponent";
import TopBar from "./components/TopBar";
import sceneStore from "./stores/SceneStore";

export default class App {

    public constructor() {
        this.bootstrap();
    }

    public bootstrap() {
        const sonar = new SonarQubeStore();
        dispatcher.register(sonar.handleEvents.bind(sonar));
    }

    public init() {
        Actions.initApp();
    }

    public run(target: string) {
        ReactDOM.render(
            <div>
                <CityBuilder store={cityBuilderConfig} />
                <SceneComponent store={sceneStore}/>
                <TopBar />
            </div>,
            document.getElementById(target)!
        );
    }
}
