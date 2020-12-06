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

import { assert, expect } from "chai";
import { mount, shallow } from "enzyme";
import * as React from "react";
import * as Sinon from "sinon";
import { TreeElement } from "../../../src/classes/TreeElement";
import FolderContent, { NodeListProps } from "../../../src/components/sidebar/FolderContent";
import FolderContentElement from "../../../src/components/sidebar/FolderContentElement";
import { HtmlDomService } from "../../../src/services/HtmlDomService";
import SceneStore from "../../../src/stores/SceneStore";
import {
    createDefaultDir,
    createDefaultFile,
    createDefaultFileWithIdAndParent,
} from "../../classes/TreeElement.spec";
import { createMock } from "../../Helper";

describe("<FolderContent/>", () => {
    it("should show siblings of the selected element as list", () => {
        const parent: TreeElement = createDefaultDir();
        const child1: TreeElement = createDefaultFileWithIdAndParent("child1", parent);
        const child2: TreeElement = createDefaultFileWithIdAndParent("child2", parent);

        parent.children.push(child1);
        parent.children.push(child2);

        const localSceneStore: SceneStore = new SceneStore();
        localSceneStore.projectData = parent;
        localSceneStore.selectedObjectId = child1.id;

        const sideBarLeafInfo = shallow(
            <FolderContent activeFolder={parent} sceneStore={localSceneStore} />
        );

        expect(
            sideBarLeafInfo.contains(
                <FolderContentElement
                    element={child1}
                    isSelected={true}
                    sceneStore={localSceneStore}
                />
            )
        ).to.be.true;

        expect(
            sideBarLeafInfo.contains(
                <FolderContentElement
                    element={child2}
                    isSelected={false}
                    sceneStore={localSceneStore}
                />
            )
        ).to.be.true;
    });

    it("should show children of the selected element as list", () => {
        const root: TreeElement = createDefaultDir();
        const child1: TreeElement = createDefaultFile();
        const child2: TreeElement = createDefaultFile();
        root.children.push(child1);
        root.children.push(child2);

        const localSceneStore: SceneStore = new SceneStore();
        localSceneStore.projectData = root;

        const selectedElementInfo = shallow(
            <FolderContent activeFolder={root} sceneStore={localSceneStore} />
        );

        expect(selectedElementInfo.find("ul.node-list")).to.have.length(1);

        expect(
            selectedElementInfo.contains(
                <FolderContentElement
                    element={child1}
                    isSelected={false}
                    sceneStore={localSceneStore}
                />
            )
        ).to.be.true;

        expect(
            selectedElementInfo.contains(
                <FolderContentElement
                    element={child2}
                    isSelected={false}
                    sceneStore={localSceneStore}
                />
            )
        ).to.be.true;
    });

    it("should mount component with dimension update", () => {
        const htmlDomStub = createMock(HtmlDomService);
        htmlDomStub.getHeightById.callsFake(() => 123);
        htmlDomStub.getOffsetsById.callsFake(() => ({ top: 312, left: 111 }));

        const windowStub = Sinon.stub(window, "addEventListener");

        const localSceneStore: SceneStore = new SceneStore();
        Sinon.spy(FolderContent.prototype, "componentDidMount");
        const wrapper = mount(<FolderContent activeFolder={null} sceneStore={localSceneStore} />);
        expect(FolderContent.prototype.componentDidMount).to.have.property("callCount", 1);

        expect(wrapper.state().listHeight).to.be.eq(123);

        assert(windowStub.called);
        windowStub.restore();
    });

    it("should remove event listener on unmount", () => {
        const windowStub = Sinon.stub(window, "removeEventListener");

        const underTest: FolderContent = new FolderContent();
        underTest.componentWillUnmount();

        assert(windowStub.called);
        windowStub.restore();
    });

    it("should resize on component update", () => {
        const underTest: FolderContent = new FolderContent();

        const underTestSpy = Sinon.mock(underTest);
        underTestSpy.expects("onResize").once();

        const localSceneStore: SceneStore = new SceneStore();
        const prevProps: NodeListProps = {
            activeFolder: null,
            sceneStore: localSceneStore,
        };

        underTest.props = {
            activeFolder: createDefaultDir(),
            sceneStore: localSceneStore,
        };

        underTest.componentDidUpdate(prevProps);

        underTestSpy.verify();

        // do not resize if no change in active folder
        underTest.componentDidUpdate(underTest.props);

        underTestSpy.verify();
    });
});
