import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Actions from "./actions/softvisActions";
import dispatcher from "./dispatcher";
import { SonarQubeCommunicator } from "./events/sonarqube";
import Softvis3D from "./components/Softvis3D";
import windowStateStore from "./stores/WindowStateStore";

export default class App {
    public constructor() {
        this.bootstrap();
    }

    public bootstrap() {
        const sonar = new SonarQubeCommunicator();
        dispatcher.register(sonar.handleEvents.bind(sonar));
        dispatcher.register(windowStateStore.handleEvents.bind(windowStateStore));
    }

    public init() {
        Actions.initApp();
    }

    public run(target: string) {
        ReactDOM.render(
           <Softvis3D />,
            document.getElementById(target)!
        );
    }
}
