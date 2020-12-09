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
import MetricKey from "../../../../src/components/scene/information/MetricKey";
import SceneInformation from "../../../../src/components/scene/information/SceneInformation";
import CityBuilderStore from "../../../../src/stores/CityBuilderStore";
import SceneStore from "../../../../src/stores/SceneStore";
import { createMockInjection } from "../../../Helper";

describe("<SceneInformation/>", () => {
    it("should show default text div on start", () => {
        const testSceneStore: SceneStore = createMockInjection(new SceneStore());
        const cityBuilderStore: CityBuilderStore = createMockInjection(new CityBuilderStore());

        const bottomBar = shallow(<SceneInformation />);

        expect(
            bottomBar.contains(
                <MetricKey
                    title="Footprint"
                    metric={cityBuilderStore.options.profile.footprintMetric}
                    selectedElement={testSceneStore.selectedElement}
                />
            )
        ).to.be.true;

        expect(bottomBar.children()).to.be.length(3);
    });
});
