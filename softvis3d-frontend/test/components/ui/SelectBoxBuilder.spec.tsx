import * as React from "react";
import * as Sinon from "sinon";
import {assert, expect} from "chai/lib/Chai";
import {mount} from "enzyme";
import SelectBoxBuilder from "../../../src/components/ui/selectbox/SelectBoxBuilder";

describe("<SelectBoxBuilder/>", () => {

    const v1: SelectOptionValue = {
        getLabel: () => "Test 1",
        getValue: () => "test 1"
    };
    const v2: SelectOptionValue = {
        getLabel: () => "Test 2",
        getValue: () => "test 2"
    };
    const v3: SelectOptionValue = {
        getLabel: () => "Test 3",
        getValue: () => "test 3"
    };

    it("should build a functioning selectbox", () => {
        let test = null;
        const fn = (value: any) => test = value;
        const spy = Sinon.spy(fn);

        const wrapper = mount(
            <SelectBoxBuilder
                label="testForSelectBoxBuilder"
                options={[v1, v2, v3]}
                value={v1}
                onChange={spy}
            />
        );

        wrapper.find("select").simulate("change", {target: { value : v3.getValue()}});
        assert(spy.withArgs(v3).calledOnce, "Value 3 was not triggered");

        wrapper.find("select").simulate("change", {target: { value : v2.getValue()}});
        wrapper.find("select").simulate("change", {target: { value : v3.getValue()}});
        assert(spy.neverCalledWith(v1), "Value 1 was triggered");
        assert(spy.withArgs(v2).calledOnce, "Value 2 was not triggered");
        assert(spy.withArgs(v3).calledTwice, "Value 3 was not triggered again");

        expect(wrapper.html()).to.contain("testForSelectBoxBuilder");
    });
});