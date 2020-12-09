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
import Scene from "../../../src/components/scene/Scene";
import SideBar from "../../../src/components/sidebar/SideBar";
import TopBar from "../../../src/components/topbar/TopBar";
import Visualization from "../../../src/components/visualization/Visualization";
import SceneStore from "../../../src/stores/SceneStore";
import { createMockInjection } from "../../Helper";

describe("<Visualization/>", () => {
    it("should not render any children, when no visualization (shapes) is ready", () => {
        const localSceneStore: SceneStore = createMockInjection(new SceneStore());

        localSceneStore.shapes = null;

        const visualization = shallow(<Visualization />);

        expect(visualization.children()).to.have.length(1);

        expect(visualization.contains(<TopBar />)).to.be.true;
    });

    it("should initialize all elements on start - shapes available but empty", () => {
        const localSceneStore: SceneStore = createMockInjection(new SceneStore());
        localSceneStore.shapes = {};

        const visualization = shallow(<Visualization />);

        expect(visualization.children()).to.have.length(3);
        expect(visualization.contains(<TopBar />)).to.be.true;
        expect(visualization.contains(<Scene />)).to.be.true;
        expect(visualization.contains(<SideBar />)).to.be.true;
    });
});
