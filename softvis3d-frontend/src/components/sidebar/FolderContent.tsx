import * as React from "react";
import {observer} from "mobx-react";
import Scrollbars from "react-custom-scrollbars";
import FolderContentElement from "./FolderContentElement";
import {SceneStore} from "../../stores/SceneStore";
import {HtmlDom, Offset} from "../../services/HtmlDom";
import {TreeElement} from "../../classes/TreeElement";

export interface NodeListProps {
    activeFolder: TreeElement|null;
    sceneStore: SceneStore;
}

interface NodeListStates {
    listHeight: number;
}

@observer
export default class FolderContent extends React.Component<NodeListProps, NodeListStates> {
    private rafID: number | null;

    constructor(p?: NodeListProps, context?: any) {
        super(p, context);

        this.state = {
            listHeight: 0
        };
    }

    public updateDimensions() {
        const sceneHeight: number = HtmlDom.getHeightById("softvis3dscene");
        const sceneOffsets: Offset = HtmlDom.getOffsetsById("softvis3dscene");
        const scrollerOffset: Offset = HtmlDom.getOffsetsById("node-scroller");

        this.setState({
            listHeight: sceneHeight - scrollerOffset.top + sceneOffsets.top
        });
    }

    public onResize() {
        if (!this.rafID) {
            this.rafID = window.requestAnimationFrame(() => {
                this.rafID = null;
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
            <Scrollbars id="node-scroller" style={{ width: "100%", height: this.state.listHeight }}>
                <ul className="node-list">
                    {elements}
                </ul>
            </Scrollbars>
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
