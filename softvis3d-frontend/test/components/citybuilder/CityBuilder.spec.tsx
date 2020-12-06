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
import AdvancedAnalysisOptions from "../../../src/components/citybuilder/AdvancedAnalysisOptions";
import CityBuilder from "../../../src/components/citybuilder/CityBuilder";
import OptionsSimple from "../../../src/components/citybuilder/OptionsSimple";
import AppStatusStore from "../../../src/stores/AppStatusStore";
import CityBuilderStore from "../../../src/stores/CityBuilderStore";
import SceneStore from "../../../src/stores/SceneStore";

describe("<CityBuilder/>", () => {
    it("should show if appStore isVisible and cityStore show", () => {
        const testCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        const testAppStatusStore: AppStatusStore = new AppStatusStore();
        const testSceneStore: SceneStore = new SceneStore();

        testCityBuilderStore.show = true;

        const cityBuilder = shallow(
            <CityBuilder
                store={testCityBuilderStore}
                appStatusStore={testAppStatusStore}
                sceneStore={testSceneStore}
            />
        );

        expect(cityBuilder.children().length).to.be.greaterThan(1);
    });

    it("should show advanced tab on click", () => {
        const testCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        const testAppStatusStore: AppStatusStore = new AppStatusStore();
        const testSceneStore: SceneStore = new SceneStore();

        testCityBuilderStore.show = true;

        const cityBuilder = shallow(
            <CityBuilder
                store={testCityBuilderStore}
                appStatusStore={testAppStatusStore}
                sceneStore={testSceneStore}
            />
        );

        expect(
            cityBuilder.contains(<OptionsSimple store={testCityBuilderStore} baseUrl={undefined} />)
        ).to.be.true;
        expect(cityBuilder.contains(<AdvancedAnalysisOptions store={testCityBuilderStore} />)).to.be
            .false;

        cityBuilder.find("#city-builder-tab-1").simulate("click");

        expect(
            cityBuilder.contains(<OptionsSimple store={testCityBuilderStore} baseUrl={undefined} />)
        ).to.be.false;
        expect(cityBuilder.contains(<AdvancedAnalysisOptions store={testCityBuilderStore} />)).to.be
            .true;
    });

    it("should not show if cityStore show is false", () => {
        const testCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        testCityBuilderStore.show = false;
        const testAppStatusStore: AppStatusStore = new AppStatusStore();
        const testSceneStore: SceneStore = new SceneStore();

        const cityBuilder = shallow(
            <CityBuilder
                store={testCityBuilderStore}
                appStatusStore={testAppStatusStore}
                sceneStore={testSceneStore}
            />
        );

        expect(cityBuilder.children().length).to.be.eq(0);
    });
});
