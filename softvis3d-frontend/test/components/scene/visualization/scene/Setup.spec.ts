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
import {Setup} from "../../../../../src/components/scene/visualization/scene/Setup";
import * as Sinon from "sinon";

describe("Setup", () => {

    it("should construct and init renderer and lights", () => {
        const container: any = {
            clientWidth: 45,
            clientHeight: 78
        };

        const renderer: any = {
            setSize: Sinon.stub(),
            setViewport: Sinon.stub(),
            setClearColor: Sinon.stub()
        };

        const sceneMock: any = {
            add: Sinon.stub()
        };

        Setup.initRenderer(renderer, sceneMock, container);

        assert(renderer.setSize.calledWith(container.clientWidth, container.clientHeight));
        assert(renderer.setViewport.calledWith(0, 0, container.clientWidth, container.clientHeight));

        expect(sceneMock.add.callCount).to.be.eq(5);
    });

});