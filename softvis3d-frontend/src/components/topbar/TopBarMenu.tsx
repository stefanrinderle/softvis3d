import * as React from "react";
import {observer} from "mobx-react";
import {CityBuilderStore} from "../../stores/CityBuilderStore";

@observer
export default class TopBarMenu extends React.Component<{ cityBuilderStore: CityBuilderStore }, any> {

    public render() {
        return (
            <div className="top-bar-menu">
                <button
                    className="left"
                    onClick={this.showBuilder.bind(this)}
                    disabled={this.props.cityBuilderStore.show}
                >
                    Settings
                </button>

                <button
                    className="middle"
                    onClick={this.openHelp.bind(this)}
                >
                    Help
                </button>
                <button
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
