///
/// softvis3d-frontend
/// Copyright (C) 2020 Stefan Rinderle and Yvo Niedrich
/// stefan@rinderle.info / yvo.niedrich@gmail.com
///
/// This program is free software; you can redistribute it and/or
/// modify it under the terms of the GNU Lesser General Public
/// License as published by the Free Software Foundation; either
/// version 3 of the License, or (at your option) any later version.
///
/// This program is distributed in the hope that it will be useful,
/// but WITHOUT ANY WARRANTY; without even the implied warranty of
/// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
/// Lesser General Public License for more details.
///
/// You should have received a copy of the GNU Lesser General Public
/// License along with this program; if not, write to the Free Software
/// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
///

import { observer } from "mobx-react";
import * as React from "react";
import Scrollbars from "react-custom-scrollbars";
import { TreeElement } from "../../classes/TreeElement";
import { lazyInject } from "../../inversify.config";
import { HtmlDomService, Offset } from "../../services/HtmlDomService";
import SceneStore from "../../stores/SceneStore";
import FolderContentElement from "./FolderContentElement";

// FIXME
const ScrollbarsWORKAROUND = Scrollbars as any;

export interface NodeListProps {
    activeFolder: TreeElement | null;
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
            listHeight: 0,
        };
    }

    public updateDimensions() {
        const sceneHeight: number = this.htmlDomService.getHeightById("softvis3dscene");
        const sceneOffsets: Offset = this.htmlDomService.getOffsetsById("softvis3dscene");
        const scrollerOffset: Offset = this.htmlDomService.getOffsetsById("node-scroller");

        this.setState({
            listHeight: sceneHeight - scrollerOffset.top + sceneOffsets.top,
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
            <ScrollbarsWORKAROUND
                id="node-scroller"
                style={{ width: "100%", height: this.state.listHeight }}
            >
                <ul className="node-list">{elements}</ul>
            </ScrollbarsWORKAROUND>
        );
    }

    private getElementList(folder: TreeElement | null): JSX.Element[] {
        if (folder === null) {
            return [];
        }

        return folder.getSortedChildren().map((child) => this.getElement(child));
    }

    private getElement(child: TreeElement): JSX.Element {
        const { sceneStore } = this.props;

        return (
            <FolderContentElement
                key={child.id}
                element={child}
                isSelected={child.id === sceneStore.selectedObjectId}
                sceneStore={sceneStore}
            />
        );
    }
}
