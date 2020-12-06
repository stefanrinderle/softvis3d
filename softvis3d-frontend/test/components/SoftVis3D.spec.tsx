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



import {expect} from "chai";
import {shallow} from "enzyme";
import * as React from "react";
import * as Sinon from "sinon";
import CityBuilder from "../../src/components/citybuilder/CityBuilder";
import Softvis3D from "../../src/components/Softvis3D";
import Status from "../../src/components/status/Status";
import Visualization from "../../src/components/visualization/Visualization";
import AppStatusStore from "../../src/stores/AppStatusStore";
import CityBuilderStore from "../../src/stores/CityBuilderStore";
import SceneStore from "../../src/stores/SceneStore";

describe("<SoftVis3D/>", () => {

    it("should draw all componenty on start", () => {
        const localCityBuilderStore: CityBuilderStore = Sinon.createStubInstance(CityBuilderStore);
        const localSceneStore: SceneStore = Sinon.createStubInstance(SceneStore);
        const localAppStatusStore: AppStatusStore = Sinon.createStubInstance(AppStatusStore);
        const baseUrl = "suzdgs";
        const softvis3d = shallow(
            <Softvis3D cityBuilderStore={localCityBuilderStore}
                       sceneStore={localSceneStore} appStatusStore={localAppStatusStore}
                       baseUrl={baseUrl}/>
        );

        expect(softvis3d.contains(<Status appStatusStore={localAppStatusStore}/>)).to.be.true;
        expect(softvis3d.contains(
            <CityBuilder store={localCityBuilderStore}
                         appStatusStore={localAppStatusStore}
                         sceneStore={localSceneStore}
                         baseUrl={baseUrl}/>
        )).to.be.true;
        expect(softvis3d.contains(
            <Visualization cityBuilderStore={localCityBuilderStore} sceneStore={localSceneStore}/>
        )).to.be.true;
    });

});