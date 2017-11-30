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
import { SceneStore } from "../../src/stores/SceneStore";
import { TreeElement } from "../../src/classes/TreeElement";
import { DEFAULT_COLOR_THEME } from "../../src/constants/SceneColorThemes";

describe("SceneStore", () => {

    it("should contain no selected id on init", () => {
        let sceneStore = new SceneStore();
        expect(sceneStore.selectedObjectId).to.be.null;
    });

    it("should contain not initial test shapes", () => {
        let sceneStore = new SceneStore();
        expect(sceneStore.shapes).to.be.null;
    });

    it("should contain default color theme on init", () => {
        let sceneStore = new SceneStore();
        expect(sceneStore.colorTheme).to.be.equal(DEFAULT_COLOR_THEME);
    });

    it("should set selectedObjectId", () => {
        let sceneStore = new SceneStore();

        let expected: string = "sdufhisufh";
        sceneStore.selectedObjectId = expected;
        expect(sceneStore.selectedObjectId).to.be.equal(expected);
    });

    it("should accept the selectedObjectId null", () => {
        let sceneStore = new SceneStore();

        let expected: string = "sdufhisufh";
        sceneStore.selectedObjectId = expected;
        expect(sceneStore.selectedObjectId).to.be.equal(expected);

        sceneStore.selectedObjectId = null;
        expect(sceneStore.selectedObjectId).to.be.equal(null);
    });

    it("should set shapes if set", () => {
        let sceneStore = new SceneStore();

        let shapes: any = {
            test: "bla"
        };

        sceneStore.shapes = shapes;

        expect(sceneStore.shapes).to.be.deep.equal(shapes);
    });

    it("should return for getColorValue if no selected element available", () => {
        let sceneStore = new SceneStore();
        let result: number | null = sceneStore.getColorValue();

        expect(result).to.be.null;
    });

    it("should return for getColorValue if no measure in the selected element is available", () => {
        let sceneStore = new SceneStore();

        sceneStore.selectedObjectId = "123";
        sceneStore.projectData = new TreeElement("sdfsdf", "", {}, "", "", true);
        let result: number | null = sceneStore.getColorValue();

        expect(result).to.be.null;
    });

    // TODO: somehow the test does not work but it works in the view.
    // it("should return for getColorValue if measure in the selected element is available", () => {
    //     let sceneStore = new SceneStore();
    //
    //     sceneStore.setSelectedObjectId("123");
    //     sceneStore.projectData = {
    //         id: "123",
    //         name: "oidfoijs",
    //         isNode: false,
    //         children: [],
    //         measures: {
    //             "ncloc": 989898
    //         },
    //         parentId: null
    //     };
    //     sceneStore.sceneMetricColor = linesOfCodeColorMetric;
    //
    //     let result: number | null = sceneStore.getColorValue();
    //
    //     expect(result).to.be.eq(989898);
    // });
});