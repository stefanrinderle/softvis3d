import * as React from "react";
import {observer} from "mobx-react";
import VisualizationLinkService from "../../services/VisualizationLinkService";
import ClipBoardService from "../../services/ClipBoardService";

interface TopBarShareButtonProbs {
    show: boolean;
    visualizationLinkService: VisualizationLinkService;
}

interface TopBarShareButtonStates {
    isShareMenuVisible: boolean;
}

@observer
export default class TopBarShareButton extends React.Component<TopBarShareButtonProbs, TopBarShareButtonStates> {

    public componentWillMount() {
        this.setShareMenuState(false);
    }

    public render() {
        return (
                <div className="dropdown"
                     onMouseEnter={() => this.setShareMenuState(true)}
                     onMouseLeave={() => this.setShareMenuState(false)}>
                    <button
                        className="middle"
                        disabled={this.props.show}
                    >
                        Share
                    </button>
                    <div className={this.getShareMenuClassName()}>
                        <span onClick={this.copyVisualizationLink.bind(this)}>Copy to clipboard</span><br />
                        <span onClick={this.openVisualizationLink.bind(this)}>Open in new tab</span>
                    </div>
                </div>
        );
    }

    private getShareMenuClassName(): string {
        let classes: string[] = [];

        classes.push("dropdown-menu");

        if (this.state.isShareMenuVisible && !this.props.show) {
            classes.push("dropdown-menu-open");
        }

        return classes.join(" ");
    }

    private setShareMenuState(value: boolean) {
        this.setState({
            isShareMenuVisible: value
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

}
