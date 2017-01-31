import * as React from "react";
import {observer} from "mobx-react";
import { Scrollbars } from "react-custom-scrollbars";
import ElementInfo from "./ElementInfo";
import {SceneStore} from "../../stores/SceneStore";
import {TreeService} from "../../services/TreeService";
import HtmlDom from "../../services/HtmlDom";

interface NodeListProps {
    selectedElement: TreeElement;
    sceneStore: SceneStore;
}

interface NodeListStates {
    listHeight: number;
}

@observer
export default class NodeList extends React.Component<NodeListProps, NodeListStates> {
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
        const elements = this.getElementList();

        if (elements.length === 0) {
            // TODO: "Error" is not the Way to go :-/
            return <ul>
                <li key="error">ERROR</li>
            </ul>;
        }

        return (
            <Scrollbars id="node-scroller" style={{ width: "100%", height: this.state.listHeight }}>
                <ul className="node-list">
                    {elements}
                </ul>
            </Scrollbars>
        );
    }

    private getElementList(): JSX.Element[] {
        const folder = this.getActiveFolder();

        if (folder === null) {
            return [];
        }

        let folderElements: JSX.Element[] = [
            <ElementInfo
                key={folder.id}
                element={folder}
                sceneStore={this.props.sceneStore}
                isSelected={folder.id === this.props.selectedElement.id}
                isOrigin={true}
            />
        ];
        for (let child of folder.children) {
            folderElements.push(
                <ElementInfo
                    key={child.id}
                    element={child}
                    isSelected={child.id === this.props.selectedElement.id}
                    sceneStore={this.props.sceneStore}
                />
            );
        }

        return folderElements;
    }

    private getActiveFolder() {
        return this.props.selectedElement.isNode
            ? this.props.selectedElement
            : this.getParentElement(this.props.selectedElement);
    }

    private getParentElement(element: TreeElement) {
        if (!this.props.sceneStore.legacyData) {
            return null;
        }

        return TreeService.searchParentNode(this.props.sceneStore.legacyData, element);
    }
}
