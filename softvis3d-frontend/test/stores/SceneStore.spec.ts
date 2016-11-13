///
/// softvis3d-frontend
/// Copyright (C) 2016 Stefan Rinderle and Yvo Niedrich
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
import { SceneStore, default as sceneStore } from "../../src/stores/SceneStore";
import { INITIAL_SHAPES } from "../../src/stores/InitialSceneShapes";

describe("SceneStore", () => {

    it("should contain no selected id on init", () => {
        expect(sceneStore.selectedObjectId).to.be.undefined;
    });

    it("should contain initial test shapes", () => {
        expect(sceneStore.shapes).not.to.be.undefined;
        expect(sceneStore.shapes).not.to.be.null;
        expect(sceneStore.shapes).not.to.be.equal(INITIAL_SHAPES);
    });

    it("should set selectedObjectId", () => {
        let expected: string = "sdufhisufh";
        sceneStore.setSelectedObjectId(expected);

        expect(sceneStore.selectedObjectId).to.be.equal(expected);
    });

    /**
     * TODO: This does not work yet. How to get a clean sceneStore for each test?
     */
    // it("should not set selectedObjectId on null", () => {
    //     let input: string | null = null;
    //
    //     sceneStore.setSelectedObjectId(input);
    //
    //     expect(sceneStore.selectedObjectId).to.be.undefined;
    // });

});