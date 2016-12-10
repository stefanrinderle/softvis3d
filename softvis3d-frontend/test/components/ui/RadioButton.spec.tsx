import * as React from "react";
import * as Sinon from "sinon";
import { expect } from "chai";
import { shallow } from "enzyme";
import { RadioButton, RadioGroup } from "../../../src/components/ui/RadioButton";

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

describe("<RadioGroup/>", () => {
    it("draw child buttons and initially select a node", () => {
        const radioGroup = shallow(
            <RadioGroup
                onChange={() => null}
                value={"btn2"}
            >
                <RadioButton value="btn1" label="Button 1"/>
                <RadioButton value="btn2" label="Button 2"/>
                <RadioButton value="btn3" label="Button 3"/>
            </RadioGroup>
        );

        expect(radioGroup.find(RadioButton)).to.be.length(3);

        const activeButtons = radioGroup.findWhere((n) => n.prop("checked"));
        expect(activeButtons).to.have.length(1);
        expect(activeButtons.prop("value")).to.be.equal("btn2");
    });

    it("propagnates button onclick events", () => {
        const fn = (activeValue: any) => { radioGroup.setProps( {value: activeValue}); };
        const spy = Sinon.spy(fn);

        const radioGroup = shallow(
            <RadioGroup
                onChange={spy}
                value={"btn2"}
            >
                <RadioButton value="btn1" label="Button 1"/>
                <RadioButton value="btn2" label="Button 2"/>
                <RadioButton value="btn3" label="Button 3" disabled={true}/>
            </RadioGroup>
        );

        expect(radioGroup.find(RadioButton)).to.be.length(3);

        let activeButtons = radioGroup.findWhere((n) => n.prop("checked"));
        expect(activeButtons).to.have.length(1);
        expect(activeButtons.prop("value")).to.be.equal("btn2");
        expect(spy.notCalled).to.be.equal(true, "callback should not have been invoked yet");

        radioGroup.find(RadioButton).first().shallow().find("input").simulate("change");

        activeButtons = radioGroup.findWhere((n) => n.prop("checked"));
        expect(activeButtons).to.have.length(1);
        expect(activeButtons.prop("value")).to.be.equal("btn1");
        expect(spy.calledOnce).to.be.equal(true, "callback should have been invoked by change event");
    });

    it("will not trigger for disabled buttons", () => {
        const fn = (activeValue: any) => { radioGroup.setProps( {value: activeValue}); };
        const spy = Sinon.spy(fn);

        const radioGroup = shallow(
            <RadioGroup
                onChange={spy}
                value={"btn2"}
            >
                <RadioButton value="btn1" label="Button 1"/>
                <RadioButton value="btn2" label="Button 2"/>
                <RadioButton value="btn3" label="Button 3" disabled={true}/>
            </RadioGroup>
        );

        expect(radioGroup.find(RadioButton)).to.be.length(3);

        let activeButtons = radioGroup.findWhere((n) => n.prop("checked"));
        expect(activeButtons).to.have.length(1);
        expect(activeButtons.prop("value")).to.be.equal("btn2");

        radioGroup.find(RadioButton).last().shallow().find("input").simulate("change");
        expect(spy.notCalled).to.be.equal(true, "callback should not have been invoked");

        activeButtons = radioGroup.findWhere((n) => n.prop("checked"));
        expect(activeButtons).to.have.length(1);
        expect(activeButtons.prop("value")).to.be.equal("btn2");
    });

    it("will not trigger anything if the group is disabled", () => {
        const fn = (activeValue: any) => { radioGroup.setProps( {value: activeValue}); };
        const spy = Sinon.spy(fn);

        const radioGroup = shallow(
            <RadioGroup
                onChange={spy}
                value={"btn2"}
                disabled={true}
            >
                <RadioButton value="btn1" label="Button 1"/>
                <RadioButton value="btn2" label="Button 2"/>
                <RadioButton value="btn3" label="Button 3"/>
            </RadioGroup>
        );

        expect(radioGroup.find(RadioButton)).to.be.length(3);

        let activeButtons = radioGroup.findWhere((n) => n.prop("checked"));
        expect(activeButtons).to.have.length(1);
        expect(activeButtons.prop("value")).to.be.equal("btn2");

        radioGroup.find(RadioButton).last().shallow().find("input").simulate("change");

        activeButtons = radioGroup.findWhere((n) => n.prop("checked"));
        expect(activeButtons).to.have.length(1);
        expect(activeButtons.prop("value")).to.be.equal("btn2");

        radioGroup.find(RadioButton).first().shallow().find("input").simulate("change");

        activeButtons = radioGroup.findWhere((n) => n.prop("checked"));
        expect(activeButtons).to.have.length(1);
        expect(activeButtons.prop("value")).to.be.equal("btn2");

        expect(spy.notCalled).to.be.equal(true, "callback should not have been invoked");
    });

    it("will not overwrite attributes of children (other than RadioButtons)", () => {
        let myValue = 0;
        let myRadioValue = 0;

        const fn = () => { myValue++; };
        const spy = Sinon.spy(fn);

        const radiofn = () => { myRadioValue++; };
        const radioSpy = Sinon.spy(radiofn);

        const radioGroup = shallow(
            <RadioGroup
                onChange={radioSpy}
            >
                <RadioButton value="btn1" label="Button 1"/>
                <input type="checkbox" onChange={spy} />
            </RadioGroup>
        );

        expect(radioGroup.find("input")).to.be.length(1);
        expect(radioGroup.find(RadioButton)).to.be.length(1);

        radioGroup.find(RadioButton).first().shallow().find("input").simulate("change");
        expect(spy.notCalled).to.be.equal(true, "Method fn should not have been called");
        expect(radioSpy.calledOnce).to.be.true;

        radioGroup.find("input").first().simulate("change");
        expect(spy.calledOnce).to.be.true;
        expect(radioSpy.calledOnce).to.be.true;
        expect(myValue).to.be.equal(myRadioValue);
    });
});