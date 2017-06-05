import * as React from "react";
import { observer } from "mobx-react";
import VisualizationLinkService from "../../services/VisualizationLinkService";
import ClipBoardService from "../../services/ClipBoardService";

interface TopBarShareButtonProbs {
    disabled: boolean;
    visualizationLinkService: VisualizationLinkService;
}

interface TopBarShareButtonStates {
    isVisible: boolean;
}

@observer
export default class TopBarShareButton extends React.Component<TopBarShareButtonProbs, TopBarShareButtonStates> {

    public componentWillMount() {
        this.setShareMenuState(false);
    }

    public render() {
        return (
            <div className="dropdown" onMouseEnter={() => this.setShareMenuState(true)}
                 onMouseLeave={() => this.setShareMenuState(false)}>
                <button className="middle" disabled={this.props.disabled}>
                    Share
                </button>
                <div className={this.getShareMenuClassName()}>
                    <button onClick={this.copyVisualizationLink.bind(this)}>Copy to clipboard</button>
                    <button onClick={this.openVisualizationLink.bind(this)}>Open in new tab</button>
                    <button onClick={this.openPlainVisualizationLink.bind(this)}>Open in new plain tab</button>
                </div>
            </div>
        );
    }

    private getShareMenuClassName(): string {
        let classes: string[] = [];

        classes.push("dropdown-menu");

        if (this.state.isVisible) {
            classes.push("open");
        }

        return classes.join(" ");
    }

    private setShareMenuState(value: boolean) {
        this.setState({
            isVisible: value && !this.props.disabled
        });
    }

    private openVisualizationLink() {
        window.open(this.props.visualizationLinkService.createVisualizationLink());
        this.setShareMenuState(false);
    }

    private copyVisualizationLink() {
        ClipBoardService.copyTextToClipboard(this.props.visualizationLinkService.createVisualizationLink());
        this.setShareMenuState(false);
    }

    private openPlainVisualizationLink() {
        let result: string = this.props.visualizationLinkService.createPlainVisualizationLink();
        window.open(result);

        this.setShareMenuState(false);
    }

}
