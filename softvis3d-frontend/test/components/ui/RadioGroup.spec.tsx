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
import { expect } from "chai";
import { shallow } from "enzyme";
import { RadioButton } from "../../../src/components/ui/RadioButton";
import { RadioGroup } from "../../../src/components/ui/RadioGroup";

describe("<RadioGroup/>", () => {
    it("draw child buttons and initially select a node", () => {
        const expectedValue = { id: "btn2" };
        const radioGroup = shallow(
            <RadioGroup onChange={() => null} value={expectedValue}>
                <RadioButton value={{ id: "btn1" }} label="Button 1" />
                <RadioButton value={expectedValue} label="Button 2" />
                <RadioButton value={{ id: "btn3" }} label="Button 3" />
            </RadioGroup>
        );

        expect(radioGroup.find(RadioButton)).to.be.length(3);

        const activeButtons = radioGroup.findWhere((n) => n.prop("checked"));
        expect(activeButtons).to.have.length(1);
        expect(activeButtons.prop("value")).to.be.equal(expectedValue);
    });

    it("propagates button onclick events", () => {
        const fn = (activeValue: any) => {
            radioGroup.setProps({ value: activeValue });
        };
        const spy = Sinon.spy(fn);

        const expectedValue1 = { id: "btn1" };
        const expectedValue2 = { id: "btn2" };
        const radioGroup = shallow(
            <RadioGroup onChange={spy} value={expectedValue2}>
                <RadioButton value={expectedValue1} label="Button 1" />
                <RadioButton value={expectedValue2} label="Button 2" />
                <RadioButton value={{ id: "btn3" }} label="Button 3" />
            </RadioGroup>
        );

        expect(radioGroup.find(RadioButton)).to.be.length(3);

        let activeButtons = radioGroup.findWhere((n) => n.prop("checked"));
        expect(activeButtons).to.have.length(1);
        expect(activeButtons.prop("value")).to.be.equal(expectedValue2);
        expect(spy.notCalled).to.be.equal(true, "callback should not have been invoked yet");

        radioGroup.find(RadioButton).first().shallow().find("input").simulate("change");

        activeButtons = radioGroup.findWhere((n) => n.prop("checked"));
        expect(activeButtons).to.have.length(1);
        expect(activeButtons.prop("value")).to.be.equal(expectedValue1);
        expect(spy.calledOnce).to.be.equal(
            true,
            "callback should have been invoked by change event"
        );
    });

    it("will not trigger for disabled buttons", () => {
        const fn = (activeValue: any) => {
            radioGroup.setProps({ value: activeValue });
        };
        const spy = Sinon.spy(fn);

        const expectedValue2 = { id: "btn2" };
        const radioGroup = shallow(
            <RadioGroup onChange={spy} value={expectedValue2}>
                <RadioButton value={{ id: "btn1" }} label="Button 1" />
                <RadioButton value={expectedValue2} label="Button 2" />
                <RadioButton value={{ id: "btn3" }} label="Button 3" disabled={true} />
            </RadioGroup>
        );

        expect(radioGroup.find(RadioButton)).to.be.length(3);

        let activeButtons = radioGroup.findWhere((n) => n.prop("checked"));
        expect(activeButtons).to.have.length(1);
        expect(activeButtons.prop("value")).to.be.equal(expectedValue2);

        radioGroup.find(RadioButton).last().shallow().find("input").simulate("change");
        expect(spy.notCalled).to.be.equal(true, "callback should not have been invoked");

        activeButtons = radioGroup.findWhere((n) => n.prop("checked"));
        expect(activeButtons).to.have.length(1);
        expect(activeButtons.prop("value")).to.be.equal(expectedValue2);
    });

    it("will not trigger anything if the group is disabled", () => {
        const fn = (activeValue: any) => {
            radioGroup.setProps({ value: activeValue });
        };
        const spy = Sinon.spy(fn);

        const expectedValue2 = { id: "btn2" };
        const radioGroup = shallow(
            <RadioGroup onChange={spy} value={expectedValue2} disabled={true}>
                <RadioButton value="btn1" label="Button 1" />
                <RadioButton value={expectedValue2} label="Button 2" />
                <RadioButton value="btn3" label="Button 3" />
            </RadioGroup>
        );

        expect(radioGroup.find(RadioButton)).to.be.length(3);

        let activeButtons = radioGroup.findWhere((n) => n.prop("checked"));
        expect(activeButtons).to.have.length(1);
        expect(activeButtons.prop("value")).to.be.equal(expectedValue2);

        radioGroup.find(RadioButton).last().shallow().find("input").simulate("change");

        activeButtons = radioGroup.findWhere((n) => n.prop("checked"));
        expect(activeButtons).to.have.length(1);
        expect(activeButtons.prop("value")).to.be.equal(expectedValue2);

        radioGroup.find(RadioButton).first().shallow().find("input").simulate("change");

        activeButtons = radioGroup.findWhere((n) => n.prop("checked"));
        expect(activeButtons).to.have.length(1);
        expect(activeButtons.prop("value")).to.be.equal(expectedValue2);

        expect(spy.notCalled).to.be.equal(true, "callback should not have been invoked");
    });

    it("will not overwrite attributes of children (other than RadioButtons)", () => {
        let myValue = 0;
        let myRadioValue = 0;

        const fn = () => {
            myValue++;
        };
        const spy = Sinon.spy(fn);

        const radiofn = () => {
            myRadioValue++;
        };
        const radioSpy = Sinon.spy(radiofn);

        const radioGroup = shallow(
            <RadioGroup onChange={radioSpy} value={{ id: "btn1" }}>
                <RadioButton value={{ id: "btn1" }} label="Button 1" />
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
