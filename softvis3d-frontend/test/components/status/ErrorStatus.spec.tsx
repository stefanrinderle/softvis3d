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

import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import ErrorStatus from "../../../src/components/status/ErrorStatus";
import AppStatusStore from "../../../src/stores/AppStatusStore";
import ErrorAction from "../../../src/classes/status/ErrorAction";

describe("<ErrorStatus/>", () => {
    it("should show loading list single", () => {
        const localAppStatusStore: AppStatusStore = new AppStatusStore();

        const expectedErrorMessage = "test";
        localAppStatusStore.error(
            new ErrorAction("key", expectedErrorMessage, "", () => undefined)
        );

        const loadingQueue = shallow(<ErrorStatus appStatusStore={localAppStatusStore} />);

        expect(loadingQueue.html()).to.include(expectedErrorMessage);
    });

    it("should show loading list multi", () => {
        const localAppStatusStore: AppStatusStore = new AppStatusStore();

        const expectedErrorMessage = "test";
        const expectedErrorMessage2 = "ioiio";
        localAppStatusStore.error(
            new ErrorAction("key", expectedErrorMessage, "", () => undefined)
        );
        localAppStatusStore.error(
            new ErrorAction("key2", expectedErrorMessage2, "", () => undefined)
        );

        const loadingQueue = shallow(<ErrorStatus appStatusStore={localAppStatusStore} />);

        expect(loadingQueue.html()).to.include(expectedErrorMessage);
        expect(loadingQueue.html()).to.include(expectedErrorMessage2);
    });

    it("should draw no list elements if not visible", () => {
        const localAppStatusStore: AppStatusStore = new AppStatusStore();

        const loading = shallow(<ErrorStatus appStatusStore={localAppStatusStore} />);

        expect(loading.children().length).to.be.eq(0);
    });
});
