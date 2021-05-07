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
import FolderContentElement from "../../../src/components/sidebar/FolderContentElement";
import SceneStore from "../../../src/stores/SceneStore";
import { createDefaultFileWithName } from "../../classes/TreeElement.spec";
import { createMockInjection } from "../../Helper";

describe("<FolderContentElement/>", () => {
    it("should show element", () => {
        const expectedName = "element98szdfkjbsf";
        const selectedElement: TreeElement = createDefaultFileWithName(expectedName);
        const localSceneStore: SceneStore = createMockInjection(new SceneStore());
        localSceneStore.selectedObjectKey = "other";

        const selectedSingleFileInfo = shallow(<FolderContentElement element={selectedElement} />);

        expect(selectedSingleFileInfo.html().includes(expectedName)).to.be.true;
    });

    it("should show selected element", () => {
        const expectedName = "element98szdfkjbsf";
        const selectedElement: TreeElement = createDefaultFileWithName(expectedName);
        const localSceneStore: SceneStore = createMockInjection(new SceneStore());
        localSceneStore.selectedObjectKey = selectedElement.key;

        const selectedSingleFileInfo = shallow(<FolderContentElement element={selectedElement} />);

        expect(selectedSingleFileInfo.html().includes(expectedName)).to.be.true;
        expect(selectedSingleFileInfo.hasClass("current-selected")).to.be.true;
    });

    it("should select element on click", () => {
        const expectedName = "element98szdfkjbsf";
        const selectedElement: TreeElement = createDefaultFileWithName(expectedName);
        const localSceneStore: SceneStore = createMockInjection(new SceneStore());

        const selectedSingleFileInfo = shallow(<FolderContentElement element={selectedElement} />);

        selectedSingleFileInfo.find("li").simulate("click");

        expect(localSceneStore.selectedObjectKey).to.be.eq(expectedName);
    });

    it("should do nothing on click on already selected element", () => {
        const expectedName = "element98szdfkjbsf";
        const selectedElement: TreeElement = createDefaultFileWithName(expectedName);
        const localSceneStore: SceneStore = createMockInjection(new SceneStore());
        localSceneStore.selectedObjectKey = selectedElement.key;

        const selectedSingleFileInfo = shallow(<FolderContentElement element={selectedElement} />);

        selectedSingleFileInfo.find("li").simulate("click");
        expect(localSceneStore.selectedObjectKey).to.be.eq(localSceneStore.selectedObjectKey);
    });
});
