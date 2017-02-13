import * as React from "react";
import * as Sinon from "sinon";
import {assert} from "chai";
import {mount} from "enzyme";
import SelectBox from "../../../src/components/ui/selectbox/SelectBox";
import SelectOption from "../../../src/components/ui/selectbox/SelectOption";
import SelectGroup from "../../../src/components/ui/selectbox/SelectGroup";

describe("<SelectBox/>", () => {

    const v1: SelectOptionValue = {
        getLabel: () => "Test 1",
        getId: () => "test 1"
    };
    const v2: SelectOptionValue = {
        getLabel: () => "Test 2",
        getId: () => "test 2"
    };
    const v3: SelectOptionValue = {
        getLabel: () => "Test 3",
        getId: () => "test 3"
    };
    const v4: SelectOptionValue = {
        getLabel: () => "Test 4",
        getId: () => "test 4"
    };

    it("should trigger the correct value on change", () => {
        const fn = (value: any) => value;
        const spy = Sinon.spy(fn);

        const wrapper = mount(
            <SelectBox value={v1} onChange={spy}>
                <SelectOption value={v1}/>
                <SelectOption value={v2}/>
                <SelectOption value={v3}/>
            </SelectBox>
        );

        wrapper.find("select").simulate("change", {target: { value : v3.getId()}});
        assert(spy.withArgs(v3).calledOnce, "Value 3 was not triggered");

        wrapper.find("select").simulate("change", {target: { value : v2.getId()}});
        wrapper.find("select").simulate("change", {target: { value : v3.getId()}});
        assert(spy.neverCalledWith(v1), "Value 1 was triggered");
        assert(spy.withArgs(v2).calledOnce, "Value 2 was not triggered");
        assert(spy.withArgs(v3).calledTwice, "Value 3 was not triggered again");
    });

    it("should trigger the correct value on change within optgroups", () => {
        const fn = (value: any) => value;
        const spy = Sinon.spy(fn);

        const wrapper = mount(
            <SelectBox value={v1} onChange={spy}>
                <SelectOption value={v1}/>
                <SelectOption value={v2}/>
                <SelectGroup label="TestGroup">
                    <SelectOption value={v3}/>
                    <SelectOption value={v4}/>
                </SelectGroup>
            </SelectBox>
        );

        wrapper.find("select").simulate("mousedown");
        wrapper.find("select").simulate("mouseup");
        wrapper.find("select").simulate("click");
        assert(spy.notCalled, "Mouse Events triggered a Change");

        wrapper.find("select").simulate("change", {target: { value : v3.getId()}});
        assert(spy.withArgs(v3).calledOnce, "Value 3 was not triggered");

        wrapper.find("select").simulate("change", {target: { value : v2.getId()}});
        wrapper.find("select").simulate("change", {target: { value : v3.getId()}});
        wrapper.find("select").simulate("change", {target: { value : v4.getId()}});
        assert(spy.neverCalledWith(v1), "Value 1 was triggered");
        assert(spy.withArgs(v2).calledOnce, "Value 2 was not triggered");
        assert(spy.withArgs(v3).calledTwice, "Value 3 was not triggered again");
        assert(spy.withArgs(v4).calledOnce, "Value 4 was not triggered");
    });

    it("should trigger mouse events", () => {
        const fn = (value: any) => value;
        const spyChange = Sinon.spy(fn);
        const spyMouseDown = Sinon.spy(fn);
        const spyClick = Sinon.spy(fn);

        const wrapper = mount(
            <SelectBox
                value={v1}
                onChange={spyChange}
                onMouseDown={spyMouseDown}
                onClick={spyClick}
            >
                <SelectOption value={v1}/>
                <SelectOption value={v2}/>
                <SelectOption value={v3}/>
            </SelectBox>
        );

        wrapper.find("select").simulate("change", {target: { value : v3.getId()}});
        assert(spyMouseDown.notCalled, "MouseDown was called on `change`");
        assert(spyClick.notCalled, "Click was called on `change`");

        wrapper.find("select").simulate("mousedown");
        wrapper.find("select").simulate("mouseup");
        wrapper.find("select").simulate("click");
        assert(spyClick.calledOnce, "Click was not called");
        assert(spyMouseDown.calledOnce, "MouseDown was not called");
    });
});