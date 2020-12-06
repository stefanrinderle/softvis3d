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
import {expect} from "chai";
import {shallow} from "enzyme";
import AppStatusStore from "../../../src/stores/AppStatusStore";
import Status from "../../../src/components/status/Status";
import SoftVis3DLogo from "../../../src/components/status/SoftVis3DLogo";
import Loading from "../../../src/components/status/loading/Loading";
import ErrorStatus from "../../../src/components/status/ErrorStatus";
import LoadAction from "../../../src/classes/status/LoadAction";
import ErrorAction from "../../../src/classes/status/ErrorAction";
import InfoStatus from "../../../src/components/status/InfoStatus";

describe("<Status/>", () => {

    it("should draw loading components if loading", () => {
        const localAppStatusStore: AppStatusStore = new AppStatusStore();

        localAppStatusStore.load(new LoadAction("test", ""));

        const softvis3d = shallow(
            <Status appStatusStore={localAppStatusStore}/>
        );

        expect(softvis3d.contains(<SoftVis3DLogo/>)).to.be.true;
        expect(softvis3d.contains(<InfoStatus appStatusStore={localAppStatusStore}/>)).to.be.true;
        expect(softvis3d.contains(<Loading appStatusStore={localAppStatusStore}/>)).to.be.true;
        expect(softvis3d.contains(<ErrorStatus appStatusStore={localAppStatusStore}/>)).to.be.true;
    });

    it("should draw error components if errors", () => {
        const localAppStatusStore: AppStatusStore = new AppStatusStore();

        localAppStatusStore.error(new ErrorAction("key", "test", "", () => undefined));

        const softvis3d = shallow(
            <Status appStatusStore={localAppStatusStore}/>
        );

        expect(softvis3d.contains(<SoftVis3DLogo/>)).to.be.true;
        expect(softvis3d.contains(<InfoStatus appStatusStore={localAppStatusStore}/>)).to.be.true;
        expect(softvis3d.contains(<Loading appStatusStore={localAppStatusStore}/>)).to.be.true;
        expect(softvis3d.contains(<ErrorStatus appStatusStore={localAppStatusStore}/>)).to.be.true;
    });

    it("should draw nothing if not visible", () => {
        const localAppStatusStore: AppStatusStore = new AppStatusStore();

        const softvis3d = shallow(
            <Status appStatusStore={localAppStatusStore}/>
        );

        expect(softvis3d.children().length).to.be.eq(0);
    });

});