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
import { INITIAL_SHAPES } from "../../src/constants/InitialSceneShapes";
import {SceneStore} from "../../src/stores/SceneStore";

describe("SceneStore", () => {

    it("should contain no selected id on init", () => {
        let sceneStore = new SceneStore();
        expect(sceneStore.selectedObjectId).to.be.null;
    });

    it("should contain not initial test shapes", () => {
        let sceneStore = new SceneStore();
        expect(sceneStore.getShapes()).not.to.be.equal(INITIAL_SHAPES);
        expect(sceneStore.isShapesUpdate()).to.be.false;
    });

    it("should set selectedObjectId", () => {
        let sceneStore = new SceneStore();

        let expected: string = "sdufhisufh";
        sceneStore.setSelectedObjectId(expected);

        expect(sceneStore.selectedObjectId).to.be.equal(expected);
    });

    it("should not set selectedObjectId on null", () => {
        let sceneStore = new SceneStore();

        let expected: string = "sdufhisufh";
        sceneStore.setSelectedObjectId(expected);

        let input: string | null = null;
        sceneStore.setSelectedObjectId(input);

        expect(sceneStore.selectedObjectId).to.be.equal(expected);
    });

    it("should not have mouse moved after initialization", () => {
        let sceneStore = new SceneStore();
        expect(sceneStore.hasMouseMoved()).to.be.false;
    });

    it("should have mouse moved after set it to move", () => {
        let sceneStore = new SceneStore();
        sceneStore.setMoved();

        expect(sceneStore.hasMouseMoved()).to.be.true;
    });

    it("should have mouse moved after set it to move", () => {
        let sceneStore = new SceneStore();
        expect(sceneStore.hasMouseMoved()).to.be.false;

        sceneStore.setMoved();

        expect(sceneStore.hasMouseMoved()).to.be.true;

        sceneStore.resetMoved();

        expect(sceneStore.hasMouseMoved()).to.be.false;
    });

    it("should set shapes if set", () => {
        let sceneStore = new SceneStore();

        let shapes: any = {
            test: "bla"
        };

        sceneStore.setShapes(shapes);

        expect(sceneStore.getShapes()).to.be.eq(shapes);
        expect(sceneStore.isShapesUpdate()).to.be.false;
    });

    it("should update only if update", () => {
        let sceneStore = new SceneStore();

        let shapes: any = {
            test: "bla"
        };

        sceneStore.updateShapes(shapes);

        expect(sceneStore.getShapes()).to.be.eq(shapes);
        expect(sceneStore.isShapesUpdate()).to.be.true;
    });

});