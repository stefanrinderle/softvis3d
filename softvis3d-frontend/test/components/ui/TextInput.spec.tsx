import {assert, expect} from "chai";
import {mount, shallow} from "enzyme";
import * as React from "react";
import * as Sinon from "sinon";
import {TextInput} from "../../../src/components/ui/TextInput";

describe("<TextInput/>", () => {

    it("should draw one input and one label", () => {
        const textInput = shallow(
            <TextInput
                id="TestId"
                value=""
                label="TestLabel"
                onChange={() => null}
            />
        );

        expect(textInput.find("input")).to.have.length(1);
        expect(textInput.find("span")).to.have.length(1);
        expect(textInput.find("span").html()).to.contain("TestLabel");
    });

    it("should trigger the correct value on change", () => {
        const fn = (value: any) => value;
        const spy = Sinon.spy(fn);

        const wrapper = mount(
            <TextInput id="testId" label="testLabel" onChange={spy} value=""/>
        );

        wrapper.find("input").simulate("change", {target: { value : "blabla"}});
        assert(spy.calledOnce, "Value change event was not triggered");
    });

});