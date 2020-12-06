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
import * as Sinon from "sinon";
import { assert, expect } from "chai";
import { mount } from "enzyme";
import SelectBoxBuilder from "../../../../src/components/ui/selectbox/SelectBoxBuilder";

describe("<SelectBoxBuilder/>", () => {
    const v1: SelectOptionValue = {
        label: "Test 1",
        id: "test 1",
    };
    const v2: SelectOptionValue = {
        label: "Test 2",
        id: "test 2",
    };
    const v3: SelectOptionValue = {
        label: "Test 3",
        id: "test 3",
    };

    it("should build a functioning selectbox", () => {
        let test = null;
        const fn = (value: any) => (test = value);
        const spy = Sinon.spy(fn);

        const wrapper = mount(
            <SelectBoxBuilder
                label="testForSelectBoxBuilder"
                options={[v1, v2, v3]}
                value={v1}
                onChange={spy}
            />
        );

        wrapper.find("select").simulate("change", { target: { value: v3.id } });
        assert(spy.withArgs(v3).calledOnce, "Value 3 was not triggered");

        wrapper.find("select").simulate("change", { target: { value: v2.id } });
        wrapper.find("select").simulate("change", { target: { value: v3.id } });
        assert(spy.neverCalledWith(v1), "Value 1 was triggered");
        assert(spy.withArgs(v2).calledOnce, "Value 2 was not triggered");
        assert(spy.withArgs(v3).calledTwice, "Value 3 was not triggered again");

        expect(wrapper.html()).to.contain("testForSelectBoxBuilder");

        expect(test).not.to.eq("123");
    });
});
