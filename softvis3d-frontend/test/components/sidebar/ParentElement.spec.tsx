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
import * as Sinon from "sinon";
import { TreeElement } from "../../../src/classes/TreeElement";
import ParentElement from "../../../src/components/sidebar/ParentElement";
import SceneStore from "../../../src/stores/SceneStore";
import {
    createDefaultDir,
    createDefaultDirWithKey,
    createDefaultDirWithKeyAndParent,
    createDefaultFileWithIdAndParent,
    createDefaultFileWithParent,
} from "../../classes/TreeElement.spec";
import { createMockInjection } from "../../Helper";

describe("<ParentElement/>", () => {
    it("should show nothing if selected Element has no parent", () => {
        const element = createDefaultDir();
        const localSceneStore = createMockInjection(new SceneStore());
        localSceneStore.projectData = element;

        const sideBarSelectParent = shallow(<ParentElement />);

        expect(sideBarSelectParent.children().length).to.be.eq(0);
    });

    it("should show nothing if the parent of selected element is root", () => {
        const parent: TreeElement = createDefaultDir();
        const child1: TreeElement = createDefaultFileWithParent(parent);

        parent.children.push(child1);

        const localSceneStore = createMockInjection(new SceneStore());
        localSceneStore.projectData = parent;

        const sideBarSelectParent = shallow(<ParentElement selectedElement={parent} />);

        expect(sideBarSelectParent.children()).to.have.length(0);
    });

    it("should select parent folder on click (for node element)", () => {
        const parent: TreeElement = createDefaultDirWithKey("parent", "parent");
        const child1: TreeElement = createDefaultDirWithKeyAndParent("child1", parent);
        const child11: TreeElement = createDefaultFileWithIdAndParent("child11", child1);

        parent.children.push(child1);
        child1.children.push(child11);

        const localSceneStore = createMockInjection(Sinon.createStubInstance(SceneStore));
        localSceneStore.projectData = parent;
        localSceneStore.selectedObjectId = child1.id;
        Sinon.stub(localSceneStore, "selectedElement").returns(child1);

        const sideBarSelectParent = shallow(<ParentElement />);

        sideBarSelectParent.find(".select-parent span").simulate("click");
        expect(localSceneStore.selectedObjectId).to.be.eq("parent");
    });

    it("should select parent folder on click (for leaf element)", () => {
        const parent: TreeElement = createDefaultDirWithKey("parent", "parent");
        const child1: TreeElement = createDefaultDirWithKeyAndParent("child1", parent);
        const child11: TreeElement = createDefaultFileWithIdAndParent("child11", child1);

        parent.children.push(child1);
        child1.children.push(child11);

        const localSceneStore = createMockInjection(new SceneStore());
        localSceneStore.projectData = parent;
        localSceneStore.selectedObjectId = child11.id;

        const sideBarSelectParent = shallow(<ParentElement />);

        sideBarSelectParent.find(".select-parent span").simulate("click");
        expect(localSceneStore.selectedObjectId).to.be.eq("parent");
    });
});
