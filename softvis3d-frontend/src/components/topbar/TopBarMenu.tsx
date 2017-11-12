import * as React from "react";
import {observer} from "mobx-react";
import {CityBuilderStore} from "../../stores/CityBuilderStore";
import VisualizationLinkService from "../../services/VisualizationLinkService";
import TopBarShareButton from "./TopBarShareButton";

interface TopBarMenuProbs {
    cityBuilderStore: CityBuilderStore;
    visualizationLinkService: VisualizationLinkService;
}

@observer
export default class TopBarMenu extends React.Component<TopBarMenuProbs, any> {

    public render() {
        return (
            <div className="top-bar-menu">
                <button
                    id="settings-button"
                    className="left"
                    onClick={this.showBuilder.bind(this)}
                    disabled={this.props.cityBuilderStore.show}
                >
                    Settings
                </button>
                <TopBarShareButton
                    disabled={this.props.cityBuilderStore.show}
                    visualizationLinkService={this.props.visualizationLinkService}
                />
                <button
                    id="help-button"
                    className="middle"
                    onClick={this.openHelp.bind(this)}
                >
                    Help
                </button>
                <button
                    id="feedback-button"
                    className="right"
                    onClick={this.openFeedback.bind(this)}
                >
                    Feedback
                </button>
            </div>
        );
    }

    private showBuilder() {
        this.props.cityBuilderStore.show = true;
    }

    private openHelp() {
        window.open("http://softvis3d.com/#/help");
    }

    private openFeedback() {
        window.open("http://softvis3d.com/#/feedback");
    }
}
