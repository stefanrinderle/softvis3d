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
import LoadingQueue from "../../../../src/components/status/loading/LoadingQueue";
import AppStatusStore from "../../../../src/stores/AppStatusStore";
import LoadAction from "../../../../src/classes/status/LoadAction";

describe("<LoadingQueue/>", () => {
    it("should show loading list single", () => {
        const localAppStatusStore: AppStatusStore = new AppStatusStore();

        const expectedLoadMessage = "test";
        localAppStatusStore.load(new LoadAction("key", expectedLoadMessage));

        const loadingQueue = shallow(<LoadingQueue appStatusStore={localAppStatusStore} />);

        expect(loadingQueue.html()).to.include(expectedLoadMessage);
    });

    it("should show loading list single with status", () => {
        const localAppStatusStore: AppStatusStore = new AppStatusStore();

        const expectedLoadMessage = "test";
        const action = new LoadAction("key", expectedLoadMessage);
        localAppStatusStore.load(action);

        const pageSize = 34;
        const limit = 98;
        localAppStatusStore.loadStatusUpdate(action.key, pageSize, limit);

        const loadingQueue = shallow(<LoadingQueue appStatusStore={localAppStatusStore} />);

        expect(loadingQueue.html()).to.include(pageSize);
        expect(loadingQueue.html()).to.include(limit);
    });

    it("should show loading list multi", () => {
        const localAppStatusStore: AppStatusStore = new AppStatusStore();

        const expectedLoadMessage = "test";
        const expectedLoadMessage2 = "ioiio";
        localAppStatusStore.load(new LoadAction("key", expectedLoadMessage));
        localAppStatusStore.load(new LoadAction("key2", expectedLoadMessage2));

        const loadingQueue = shallow(<LoadingQueue appStatusStore={localAppStatusStore} />);

        expect(loadingQueue.html()).to.include(expectedLoadMessage);
        expect(loadingQueue.html()).to.include(expectedLoadMessage2);
    });

    it("should draw no list elements if not visible", () => {
        const localAppStatusStore: AppStatusStore = new AppStatusStore();

        const loading = shallow(<LoadingQueue appStatusStore={localAppStatusStore} />);

        expect(loading.children().length).to.be.eq(0);
    });
});
