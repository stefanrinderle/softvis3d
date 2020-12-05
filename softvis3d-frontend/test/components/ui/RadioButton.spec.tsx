import {expect} from "chai";
import {shallow} from "enzyme";
import * as React from "react";
import * as Sinon from "sinon";
import {RadioButton} from "../../../src/components/ui/RadioButton";

describe("<RadioButton/>", () => {
    it("should draw one input and one label", () => {

        const radioButton = shallow(
            <RadioButton
                checked={false}
                label="Test"
                onChange={() => null}
                value="0"
            />
        );

        expect(radioButton.find("input")).to.have.length(1);
        expect(radioButton.find("label")).to.have.length(1);
        expect(radioButton.instance().props.checked).to.be.false;
    });

    it("should call the onChange-Method when clicked", () => {
        let wasManipulated = false;
        const fn = () => { wasManipulated = true; };
        const changeSpy = Sinon.spy(fn);

        const radioButton = shallow(
            <RadioButton
                checked={false}
                label="Test"
                onChange={changeSpy}
                value="0"
            />
        );

        expect(changeSpy.called).to.be.false;
        expect(wasManipulated).to.be.false;

        radioButton.find("input").simulate("change");

        expect(changeSpy.calledOnce).to.equal(true, "RadioButton was not changed on label-click");
        expect(wasManipulated).to.equal(true, "RadioButton did not manupulate a local variable");
    });

    it("should react to change events", () => {
        const changeSpy = Sinon.spy(() => {
            radioButton.setProps({ checked: !radioButton.instance().props.checked });
        });

        const radioButton = shallow(
            <RadioButton
                checked={false}
                label="Test"
                onChange={changeSpy}
                value="0"
            />
        );

        expect(radioButton.instance().props.checked).to.be.false;

        radioButton.find("input").simulate("change");
        expect(changeSpy.calledOnce).to.be.true;
        expect(radioButton.instance().props.checked).to.be.true;

        radioButton.find("input").simulate("change");
        expect(changeSpy.calledTwice).to.be.true;
        expect(radioButton.instance().props.checked).to.be.false;
    });

    it("should be able to change its value", () => {
        let checked = false;
        let value = 0;

        const changeSpy = Sinon.spy(() => {
            checked = !checked;
            value++;
            radioButton.setProps({
                checked,
                value
            });
        });

        const radioButton = shallow(
            <RadioButton
                checked={false}
                label="Test"
                onChange={changeSpy}
                value={value}
            />
        );

        expect(radioButton.instance().props.checked).to.be.false;
        expect(radioButton.instance().props.value).to.be.equal(0);

        radioButton.find("input").simulate("change");
        expect(changeSpy.calledOnce).to.equal(true, "onclick was not called");
        expect(radioButton.instance().props.checked).to.be.equal(true, "buttons was not checked");
        expect(radioButton.instance().props.value).to.be.equal(1, "value was incremented");
        expect(value).to.be.equal(1, "local value was incremented");

        radioButton.find("input").simulate("change");
        expect(changeSpy.calledTwice).to.be.true;
        expect(radioButton.instance().props.checked).to.be.false;
        expect(radioButton.instance().props.value).to.be.equal(2);
        expect(value).to.be.equal(2);
    });
});