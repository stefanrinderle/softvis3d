import {observer} from "mobx-react";
import * as React from "react";
import {lazyInject} from "../../inversify.config";
import ClipBoardService from "../../services/ClipBoardService";
import VisualizationLinkService from "../../services/VisualizationLinkService";
import CityBuilderStore from "../../stores/CityBuilderStore";
import SceneStore from "../../stores/SceneStore";

interface TopBarShareButtonProbs {
    disabled: boolean;
    cityBuilderStore: CityBuilderStore;
    sceneStore: SceneStore;
}

interface TopBarShareButtonStates {
    isVisible: boolean;
}

@observer
export default class TopBarShareButton extends React.Component<TopBarShareButtonProbs, TopBarShareButtonStates> {

    @lazyInject("VisualizationLinkService")
    private readonly visualizationLinkService!: VisualizationLinkService;
    @lazyInject("ClipBoardService")
    private readonly clipBoardService!: ClipBoardService;

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
        window.open(this.visualizationLinkService.createVisualizationLink(this.props.cityBuilderStore, this.props.sceneStore));
        this.setShareMenuState(false);
    }

    private copyVisualizationLink() {
        const link = this.visualizationLinkService.createVisualizationLink(this.props.cityBuilderStore, this.props.sceneStore);
        this.clipBoardService.copyTextToClipboard(link);
        this.setShareMenuState(false);
    }

    private openPlainVisualizationLink() {
        let result: string =
            this.visualizationLinkService.createPlainVisualizationLink(this.props.cityBuilderStore, this.props.sceneStore);
        window.open(result);

        this.setShareMenuState(false);
    }

}
