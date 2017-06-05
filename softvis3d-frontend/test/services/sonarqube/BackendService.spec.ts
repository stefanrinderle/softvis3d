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
import {assert} from "chai";
import {BackendService} from "../../../src/services/sonarqube/BackendService";
import * as Sinon from "sinon";

import axios from "axios";

describe("BackendService", () => {

    it("BackendService should call axios library", () => {

        let underTest: BackendService = new TestService();

        let axiosStub = Sinon.stub(axios, "get");

        const route = "/zusfd/";
        underTest.callApi(route);

        assert(axiosStub.calledWith("/api" + route, {}));
        axiosStub.restore();
    });

    it("BackendService should call axios library with baseUrl", () => {

        let baseUrl = "iusdgzfuzgdf/";
        let underTest: BackendService = new TestService(baseUrl);

        let axiosStub = Sinon.stub(axios, "get");

        const route = "/zusfd/";
        underTest.callApi(route);

        assert(axiosStub.calledWith(baseUrl + "/api" + route, {}));
        axiosStub.restore();
    });

});

class TestService extends BackendService {
    constructor(apiUrl?: string) {
        super(apiUrl);
    }
}