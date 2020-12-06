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
import {expect} from "chai";
import LoadAction from "../../../src/classes/status/LoadAction";

describe("LoadAction", () => {

    it("should construct minimal load action", () => {
        const expectedKey = "23";
        const expectedDescription = "diufgh";

        const result: LoadAction = new LoadAction(expectedKey, expectedDescription);

        expect(result.key).to.be.eq(expectedKey);
        expect(result.description).to.be.eq(expectedDescription);
    });

    it("should save status", () => {
        const expectedKey = "23";
        const expectedDescription = "diufgh";

        const result: LoadAction = new LoadAction(expectedKey, expectedDescription);

        const max = 200;
        const current = 56;
        result.setStatus(max, current);

        expect(result.max).to.be.eq(max);
        expect(result.current).to.be.eq(current);
    });

    it("should know if a status was set or not", () => {
        const expectedKey = "23";
        const expectedDescription = "diufgh";

        const result: LoadAction = new LoadAction(expectedKey, expectedDescription);

        expect(result.hasStatus()).to.be.false;

        const max = 200;
        const current = 56;
        result.setStatus(max, current);

        expect(result.hasStatus()).to.be.true;
    });

    it("should calc percentage", () => {
        const expectedKey = "23";
        const expectedDescription = "diufgh";

        const result: LoadAction = new LoadAction(expectedKey, expectedDescription);

        let limit = 200;
        let current = 56;
        result.setStatus(limit, current);

        expect(result.percent).to.be.eq(28);

        limit = 200;
        current = 0;
        result.setStatus(limit, current);

        expect(result.percent).to.be.eq(0);

        limit = 200;
        current = 200;
        result.setStatus(limit, current);

        expect(result.percent).to.be.eq(100);
    });
});