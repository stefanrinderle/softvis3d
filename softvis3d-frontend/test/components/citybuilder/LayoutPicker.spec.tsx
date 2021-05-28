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
import { LayoutPicker } from "../../../src/components/citybuilder/LayoutPicker";
import { Layouts } from "../../../src/constants/Layouts";
import VisualizationOptionStore from "../../../src/stores/VisualizationOptionStore";
import { createMockInjection } from "../../Helper";

describe("<LayoutPicker/>", () => {
    it("should have a initial state", () => {
        const visualizationOptions = createMockInjection(VisualizationOptionStore.createDefault());

        const radioGroup = shallow(<LayoutPicker />);

        expect(visualizationOptions.layout).to.be.eq(Layouts.availableLayouts[0]);
        expect(radioGroup.find(".active")).to.be.length(1);
        expect(radioGroup.find(".active").text()).to.be.eq("Evostreet");
    });

    it("should process click event", () => {
        const visualizationOptions = createMockInjection(VisualizationOptionStore.createDefault());

        const radioGroup = shallow(<LayoutPicker />);

        const settingsButton = radioGroup.find("#district");

        expect(visualizationOptions.layout).to.be.eq(Layouts.availableLayouts[0]);
        const secondLayout = Layouts.availableLayouts[1];
        settingsButton.simulate("change", {
            target: {
                value: secondLayout.id,
            },
        });

        expect(visualizationOptions.layout).to.be.eq(secondLayout);

        radioGroup.instance().forceUpdate();

        expect(radioGroup.find(".active").text()).to.be.eq("District");
    });
});
