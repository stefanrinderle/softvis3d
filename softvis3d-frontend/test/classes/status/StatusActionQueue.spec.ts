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
import {assert, expect} from "chai";
import StatusAction from "../../../src/classes/status/StatusAction";
import StatusActionQueue from "../../../src/classes/status/StatusActionQueue";

describe("StatusActionQueue", () => {

    it("should do add remove and isEmpty", () => {
        let underTest: StatusActionQueue<TestStatusAction> = new StatusActionQueue();
        let testAction = new TestStatusAction("key", "testEvent");

        expect(underTest.isEmpty).to.be.equal(true);

        underTest.add(testAction);
        expect(underTest.isEmpty).to.be.equal(false);

        underTest.remove(testAction);
        expect(underTest.isEmpty).to.be.equal(true);
    });

    it("should update and return new instance", () => {
        let underTest: StatusActionQueue<TestStatusAction> = new StatusActionQueue();
        let testAction: TestStatusAction = new TestStatusAction("key", "testEvent");

        underTest.add(testAction);
        let result = underTest.update(testAction);
        assert(result !== underTest);
        assert(!result.isEmpty);
    });

    it("should work with multiple events", () => {
        let underTest: StatusActionQueue<TestStatusAction> = new StatusActionQueue();
        let testAction = new TestStatusAction("key", "testEvent");
        let testAction2 = new TestStatusAction("key2", "testEvent");

        underTest.add(testAction);
        underTest.add(testAction2);
        underTest.remove(testAction);
        expect(underTest.isEmpty).to.be.equal(false);
        underTest.remove(testAction2);
        expect(underTest.isEmpty).to.be.equal(true);
    });

    it("should be able to iterate", () => {
        const underTest: StatusActionQueue<TestStatusAction> = new StatusActionQueue();
        let testAction = new TestStatusAction("key", "testEvent");
        let testAction2 = new TestStatusAction("key2", "testEvent");

        underTest.add(testAction);
        underTest.add(testAction2);

        let result: TestStatusAction[] = [];
        for (let queueElement of underTest) {
            result.push(queueElement);
        }

        expect(result.length).to.be.eq(2);

        result = [];
        for (let queueElement of underTest) {
            result.push(queueElement);
        }

        expect(result.length).to.be.eq(2);
    });

});

class TestStatusAction extends StatusAction {

    constructor(key: string, description: string) {
        super(key, description);
    }

}