import * as React from "react";
import * as Sinon from "sinon";
import { assert, expect } from "chai";
import { mount } from "enzyme";
import SelectBoxBuilder from "../../../../src/components/ui/selectbox/SelectBoxBuilder";

describe("<SelectBoxBuilder/>", () => {

    const v1: SelectOptionValue = {
        label: "Test 1",
        id: "test 1"
    };
    const v2: SelectOptionValue = {
        label: "Test 2",
        id: "test 2"
    };
    const v3: SelectOptionValue = {
        label: "Test 3",
        id: "test 3"
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

        wrapper.find("select").simulate("change", {target: { value : v3.id}});
        assert(spy.withArgs(v3).calledOnce, "Value 3 was not triggered");

        wrapper.find("select").simulate("change", {target: { value : v2.id}});
        wrapper.find("select").simulate("change", {target: { value : v3.id}});
        assert(spy.neverCalledWith(v1), "Value 1 was triggered");
        assert(spy.withArgs(v2).calledOnce, "Value 2 was not triggered");
        assert(spy.withArgs(v3).calledTwice, "Value 3 was not triggered again");

        expect(wrapper.html()).to.contain("testForSelectBoxBuilder");
    });
});