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

import SelectedElementService from "../../src/services/SelectedElementService";
import TreeService from "../../src/services/TreeService";
import SceneStore from "../../src/stores/SceneStore";
import { createDefaultDir } from "../classes/TreeElement.spec";
import { createMock, createMockInjection } from "../Helper";
import { assert, expect } from "chai";

describe("SelectedElementService", () => {
    it("should request selected element", () => {
        const sceneStore = createMockInjection(new SceneStore());
        sceneStore.projectData = {};
        sceneStore.selectedObjectId = "usdhfiuh";

        const treeService = createMock(TreeService);
        const expectedElement = createDefaultDir();
        treeService.searchTreeNode.returns(expectedElement);

        const result = new SelectedElementService().getSelectedElement();

        expect(result).to.be.equal(expectedElement);
        assert(treeService.searchTreeNode.calledWith({}, "usdhfiuh"));
    });

    it("should not request if project data not set", () => {
        const sceneStore = createMockInjection(new SceneStore());
        sceneStore.projectData = null;
        sceneStore.selectedObjectId = "usdhfiuh";

        const result = new SelectedElementService().getSelectedElement();

        expect(result).to.be.null;
    });

    it("should not request if selected id not set", () => {
        const sceneStore = createMockInjection(new SceneStore());
        sceneStore.projectData = {};
        sceneStore.selectedObjectId = null;

        const result = new SelectedElementService().getSelectedElement();

        expect(result).to.be.null;
    });
});
