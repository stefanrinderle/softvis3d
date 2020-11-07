import {observer} from "mobx-react";
import * as React from "react";
import Scrollbars from "react-custom-scrollbars";
import {TreeElement} from "../../classes/TreeElement";
import {lazyInject} from "../../inversify.config";
import {HtmlDomService, Offset} from "../../services/HtmlDomService";
import {SceneStore} from "../../stores/SceneStore";
import FolderContentElement from "./FolderContentElement";

// FIXME
const ScrollbarsWORKAROUND = (Scrollbars as any);

export interface NodeListProps {
    activeFolder: TreeElement|null;
    sceneStore: SceneStore;
}

interface NodeListStates {
    listHeight: number;
}

@observer
export default class FolderContent extends React.Component<NodeListProps, NodeListStates> {

    @lazyInject("HtmlDomService")
    private readonly htmlDomService!: HtmlDomService;

    private rafID?: number;

    constructor(p?: NodeListProps, context?: any) {
        super(p, context);

        this.state = {
            listHeight: 0
        };
    }

    public updateDimensions() {
        const sceneHeight: number = this.htmlDomService.getHeightById("softvis3dscene");
        const sceneOffsets: Offset = this.htmlDomService.getOffsetsById("softvis3dscene");
        const scrollerOffset: Offset = this.htmlDomService.getOffsetsById("node-scroller");

        this.setState({
            listHeight: sceneHeight - scrollerOffset.top + sceneOffsets.top
        });
    }

    public onResize() {
        if (!this.rafID) {
            this.rafID = window.requestAnimationFrame(() => {
                this.rafID = undefined;
                this.updateDimensions();
            });
        }
    }

    public componentDidMount() {
        this.updateDimensions();
        window.addEventListener("resize", this.onResize.bind(this), false);
    }

    public componentDidUpdate(prevProps: NodeListProps) {
        if (this.props.activeFolder !== prevProps.activeFolder) {
            this.onResize();
        }
    }

    public componentWillUnmount() {
        window.removeEventListener("resize", this.onResize);
    }

    public render() {
        const elements = this.getElementList(this.props.activeFolder);

        return (
            <ScrollbarsWORKAROUND id="node-scroller" style={{ width: "100%", height: this.state.listHeight }}>
                <ul className="node-list">
                    {elements}
                </ul>
            </ScrollbarsWORKAROUND>
        );
    }

    private getElementList(folder: TreeElement | null): JSX.Element[] {
        if (folder === null) {
            return [];
        }

        return folder
            .getSortedChildren()
            .map((child) => this.getElement(child));
    }

    private getElement(child: TreeElement): JSX.Element {
        const {sceneStore} = this.props;

        return <FolderContentElement
                key={child.id}
                element={child}
                isSelected={child.id === sceneStore.selectedObjectId}
                sceneStore={sceneStore}
            />;
    }
}
