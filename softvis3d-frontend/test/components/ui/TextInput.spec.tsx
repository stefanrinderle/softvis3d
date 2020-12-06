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

import { assert, expect } from "chai";
import { mount, shallow } from "enzyme";
import * as React from "react";
import * as Sinon from "sinon";
import { TextInput } from "../../../src/components/ui/TextInput";

describe("<TextInput/>", () => {
    it("should draw one input and one label", () => {
        const textInput = shallow(
            <TextInput id="TestId" value="" label="TestLabel" onChange={() => null} />
        );

        expect(textInput.find("input")).to.have.length(1);
        expect(textInput.find("span")).to.have.length(1);
        expect(textInput.find("span").html()).to.contain("TestLabel");
    });

    it("should trigger the correct value on change", () => {
        const fn = (value: any) => value;
        const spy = Sinon.spy(fn);

        const wrapper = mount(<TextInput id="testId" label="testLabel" onChange={spy} value="" />);

        wrapper.find("input").simulate("change", { target: { value: "blabla" } });
        assert(spy.calledOnce, "Value change event was not triggered");
    });
});
