import * as React from "react";
import * as ReactDOM from "react-dom";
import CityBuilder from "./components/CityBuilder/CityBuilder";
import cityBuilderStore from "./stores/CityBuilderStore";
import * as Actions from "./actions/softvisActions";
import dispatcher from "./dispatcher";
import { SonarQubeCommunicator } from "./events/sonarqube";
import SceneComponent from "./components/scene/SceneComponent";
import TopBar from "./components/TopBar";

export default class App {

    public constructor() {
        this.bootstrap();
    }

    public bootstrap() {
        const sonar = new SonarQubeCommunicator();
        dispatcher.register(sonar.handleEvents.bind(sonar));
    }

    public init() {
        Actions.initApp();
    }

    public run(target: string) {
        ReactDOM.render(
            <div>
                <CityBuilder store={cityBuilderStore} />
                <SceneComponent/>
                <TopBar />
            </div>,
            document.getElementById(target)!
        );
    }
}
