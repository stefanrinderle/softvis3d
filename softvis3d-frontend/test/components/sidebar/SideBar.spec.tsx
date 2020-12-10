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

import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import { TreeElement } from "../../../src/classes/TreeElement";
import FolderContent from "../../../src/components/sidebar/FolderContent";
import ParentElement from "../../../src/components/sidebar/ParentElement";
import SideBar from "../../../src/components/sidebar/SideBar";
import SelectedElementService from "../../../src/services/SelectedElementService";
import {
    SQ_QUALIFIER_DIRECTORY,
    SQ_QUALIFIER_FILE,
} from "../../../src/services/sonarqube/measures/api/SonarQubeMeasureResponse";
import TreeService from "../../../src/services/TreeService";
import SceneStore from "../../../src/stores/SceneStore";
import { createDefaultDir, createDefaultFileWithParent } from "../../classes/TreeElement.spec";
import { createMock, createMockInjection } from "../../Helper";

describe("<SideBar/>", () => {
    it("should be empty, if no element is selected", () => {
        createMockInjection(new SceneStore());
        const selectedElementService = createMock(SelectedElementService);
        selectedElementService.getSelectedElement.returns(null);

        const selectedElementInfo = shallow(<SideBar />);

        expect(selectedElementInfo.hasClass("side-bar")).to.be.true;
        expect(selectedElementInfo.find("ul")).to.have.length(0);
    });

    it("should show node info for nodes", () => {
        // does not work - no idea why.
        // let parent: TreeElement = createDefaultDirWithKey("parent", "parent");
        // let child1: TreeElement = createDefaultDirWithKeyAndParent("child1", parent);
        // let child11: TreeElement = createDefaultFileWithIdAndParent("child11", child1);

        const parent: TreeElement = new TreeElement(
            "parent",
            "parent",
            {},
            "parent",
            "",
            SQ_QUALIFIER_DIRECTORY
        );
        const child1: TreeElement = new TreeElement(
            "child1",
            "child1",
            {},
            "child1",
            "",
            SQ_QUALIFIER_DIRECTORY,
            parent
        );
        const child11: TreeElement = new TreeElement(
            "child11",
            "child11",
            {},
            "child11",
            "",
            SQ_QUALIFIER_FILE,
            child1
        );

        parent.children.push(child1);
        child1.children.push(child11);

        const selectedElementService = createMock(SelectedElementService);
        selectedElementService.getSelectedElement.returns(child1);

        const localSceneStore: SceneStore = createMockInjection(new SceneStore());
        localSceneStore.projectData = parent;
        localSceneStore.selectedObjectId = child1.id;

        const localTreeService = createMock(TreeService);
        localTreeService.searchTreeNode.returns(child1);

        const shallowSidebar = shallow(<SideBar />);

        expect(shallowSidebar.hasClass("side-bar")).to.be.true;

        expect(shallowSidebar.contains(<ParentElement />)).to.be.true;

        expect(shallowSidebar.contains(<FolderContent activeFolder={child1} />)).to.be.true;

        expect(shallowSidebar.html()).to.contain(child1.id);
        expect(shallowSidebar.html()).to.contain(child11.id);
    });

    it("should show node info for leafs", () => {
        const parent: TreeElement = createDefaultDir();
        const child1: TreeElement = createDefaultFileWithParent(parent);
        const child11: TreeElement = createDefaultFileWithParent(child1);

        parent.children.push(child1);
        child1.children.push(child11);

        const localSceneStore: SceneStore = createMockInjection(new SceneStore());
        localSceneStore.projectData = parent;
        localSceneStore.selectedObjectId = child11.id;

        const selectedElementService = createMock(SelectedElementService);
        selectedElementService.getSelectedElement.returns(child11);

        const localTreeService = createMock(TreeService);
        localTreeService.searchTreeNode.returns(child11);

        const shallowSidebar = shallow(<SideBar />);

        expect(shallowSidebar.hasClass("side-bar")).to.be.true;

        expect(shallowSidebar.contains(<ParentElement />)).to.be.true;

        expect(shallowSidebar.contains(<FolderContent activeFolder={child1} />)).to.be.true;

        expect(shallowSidebar.html()).to.contain(child1.id);
        expect(shallowSidebar.html()).to.contain(child11.id);
    });
});
