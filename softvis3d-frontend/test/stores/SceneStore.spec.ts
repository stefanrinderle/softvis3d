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
import SceneStore from "../../src/stores/SceneStore";

describe("SceneStore", () => {
    it("should contain no selected id on init", () => {
        const sceneStore = new SceneStore();
        expect(sceneStore.selectedObjectKey).to.be.null;
    });

    it("should contain not initial test shapes", () => {
        const sceneStore = new SceneStore();
        expect(sceneStore.shapes).to.be.null;
    });

    it("should set selectedObjectKey", () => {
        const sceneStore = new SceneStore();

        const expected = "sdufhisufh";
        sceneStore.selectedObjectKey = expected;
        expect(sceneStore.selectedObjectKey).to.be.equal(expected);
    });

    it("should accept the selectedObjectKey null", () => {
        const sceneStore = new SceneStore();

        const expected = "sdufhisufh";
        sceneStore.selectedObjectKey = expected;
        expect(sceneStore.selectedObjectKey).to.be.equal(expected);

        sceneStore.selectedObjectKey = null;
        expect(sceneStore.selectedObjectKey).to.be.equal(null);
    });

    it("should set shapes if set", () => {
        const sceneStore = new SceneStore();

        const shapes: any = {
            test: "bla",
        };

        sceneStore.shapes = shapes;

        expect(sceneStore.shapes).to.be.deep.equal(shapes);
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
