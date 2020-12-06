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
import ErrorAction from "../../../src/classes/status/ErrorAction";
import StatusActionQueue from "../../../src/classes/status/StatusActionQueue";
import ErrorStatus from "../../../src/components/status/ErrorStatus";

describe("<ErrorStatus/>", () => {
    it("should show loading list single", () => {
        const localErrorQueue = new StatusActionQueue<ErrorAction>();

        const expectedErrorMessage = "test";
        localErrorQueue.add(new ErrorAction("key", expectedErrorMessage, "", () => undefined));

        const loadingQueue = shallow(<ErrorStatus errors={localErrorQueue} />);

        expect(loadingQueue.html()).to.include(expectedErrorMessage);
    });

    it("should show loading list multi", () => {
        const localErrorQueue = new StatusActionQueue<ErrorAction>();

        const expectedErrorMessage = "test";
        const expectedErrorMessage2 = "ioiio";
        localErrorQueue.add(new ErrorAction("key", expectedErrorMessage, "", () => undefined));
        localErrorQueue.add(new ErrorAction("key2", expectedErrorMessage2, "", () => undefined));

        const loadingQueue = shallow(<ErrorStatus errors={localErrorQueue} />);

        expect(loadingQueue.html()).to.include(expectedErrorMessage);
        expect(loadingQueue.html()).to.include(expectedErrorMessage2);
    });

    it("should draw no list elements if not visible", () => {
        const localErrorQueue = new StatusActionQueue<ErrorAction>();

        const loadingQueue = shallow(<ErrorStatus errors={localErrorQueue} />);

        expect(loadingQueue.children().length).to.be.eq(0);
    });
});
