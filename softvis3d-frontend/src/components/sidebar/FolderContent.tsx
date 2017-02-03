import * as React from "react";
import {observer} from "mobx-react";
import {Scrollbars} from "react-custom-scrollbars";
import FolderContentElement from "./FolderContentElement";
import {SceneStore} from "../../stores/SceneStore";
import HtmlDom from "../../services/HtmlDom";

interface NodeListProps {
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
        const sceneHeight = HtmlDom.getHeightById("softvis3dscene");
        const sceneOffsets = HtmlDom.getOffsetsById("softvis3dscene");
        const scrollerOffset = HtmlDom.getOffsetsById("node-scroller");

        this.setState({
            listHeight: sceneHeight - scrollerOffset.top + sceneOffsets.top
        });
    }

    public onResize () {
        if (!this.rafID) {
            this.rafID = window.requestAnimationFrame(() => {
                this.rafID = null;
                this.updateDimensions();
            });
        }
    }

    public componentDidMount () {
        this.updateDimensions();
        window.addEventListener("resize", this.onResize.bind(this), false);
    }

    public componentWillUnmount () {
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

        const {sceneStore} = this.props;

        let folderElements: JSX.Element[] = [];
        for (let child of folder.children) {
            folderElements.push(
                <FolderContentElement
                    key={child.id}
                    element={child}
                    isSelected={child.id === sceneStore.selectedObjectId}
                    sceneStore={sceneStore}
                />
            );
        }

        return folderElements;
    }
}
