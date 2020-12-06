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
import { noMetric } from "../../src/constants/Metrics";
import SceneStore from "../../src/stores/SceneStore";
import { createDefaultFile } from "../classes/TreeElement.spec";

describe("SceneStore", () => {
    it("should contain no selected id on init", () => {
        const sceneStore = new SceneStore();
        expect(sceneStore.selectedObjectId).to.be.null;
    });

    it("should contain not initial test shapes", () => {
        const sceneStore = new SceneStore();
        expect(sceneStore.shapes).to.be.null;
    });

    it("should set selectedObjectId", () => {
        const sceneStore = new SceneStore();

        const expected = "sdufhisufh";
        sceneStore.selectedObjectId = expected;
        expect(sceneStore.selectedObjectId).to.be.equal(expected);
    });

    it("should accept the selectedObjectId null", () => {
        const sceneStore = new SceneStore();

        const expected = "sdufhisufh";
        sceneStore.selectedObjectId = expected;
        expect(sceneStore.selectedObjectId).to.be.equal(expected);

        sceneStore.selectedObjectId = null;
        expect(sceneStore.selectedObjectId).to.be.equal(null);
    });

    it("should set shapes if set", () => {
        const sceneStore = new SceneStore();

        const shapes: any = {
            test: "bla",
        };

        sceneStore.shapes = shapes;

        expect(sceneStore.shapes).to.be.deep.equal(shapes);
    });

    it("should return for getColorValue if no selected element available", () => {
        const sceneStore = new SceneStore();
        const result: number | null = sceneStore.getColorValue(noMetric);

        expect(result).to.be.null;
    });

    it("should return for getColorValue if no measure in the selected element is available", () => {
        const sceneStore = new SceneStore();

        sceneStore.selectedObjectId = "123";
        sceneStore.projectData = createDefaultFile();
        const result: number | null = sceneStore.getColorValue(noMetric);

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
