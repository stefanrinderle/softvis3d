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

import axios from "axios";
import { assert } from "chai";
import * as Sinon from "sinon";
import { AppConfiguration } from "../../../src/classes/AppConfiguration";
import { BackendService } from "../../../src/services/sonarqube/BackendService";
import ComponentStatusStore from "../../../src/stores/ComponentStatusStore";
import { createMockInjection } from "../../Helper";
import { createDefaultTestComponentStatusStore } from "../../stores/ComponentStatusStore.spec";

describe("BackendService", () => {
    it("BackendService should call axios library", () => {
        createMockInjection(createDefaultTestComponentStatusStore());

        const underTest: BackendService = new TestService();

        const axiosStub = Sinon.stub(axios, "get");

        const route = "/zusfd/";
        underTest.callApi(route);

        assert(axiosStub.calledWith("/api" + route, {}));
        axiosStub.restore();
    });

    it("BackendService should call axios library with baseUrl", () => {
        const baseUrl = "iusdgzfuzgdf/";
        const config = new AppConfiguration("example:key", false, baseUrl);
        createMockInjection(new ComponentStatusStore(config));
        const underTest: BackendService = new TestService();

        const axiosStub = Sinon.stub(axios, "get");

        const route = "/zusfd/";
        underTest.callApi(route);

        assert(axiosStub.calledWith(baseUrl + "/api" + route, {}));
        axiosStub.restore();
    });
});

class TestService extends BackendService {}
