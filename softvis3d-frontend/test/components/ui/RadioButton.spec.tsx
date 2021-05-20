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
import * as Sinon from "sinon";
import { RadioButton } from "../../../src/components/ui/RadioButton";

describe("<RadioButton/>", () => {
    it("should draw one input and one label", () => {
        const radioButton = shallow(
            <RadioButton checked={false} label="Test" onChange={() => null} value="0" />
        );

        expect(radioButton.find("input")).to.have.length(1);
        expect(radioButton.find("label")).to.have.length(1);
        // expect(radioButton.instance().props.checked).to.be.false;
    });

    it("should call the onChange-Method when clicked", () => {
        let wasManipulated = false;
        const fn = () => {
            wasManipulated = true;
        };
        const changeSpy = Sinon.spy(fn);

        const radioButton = shallow(
            <RadioButton checked={false} label="Test" onChange={changeSpy} value="0" />
        );

        expect(changeSpy.called).to.be.false;
        expect(wasManipulated).to.be.false;

        radioButton.find("input").simulate("change");

        expect(changeSpy.calledOnce).to.equal(true, "RadioButton was not changed on label-click");
        expect(wasManipulated).to.equal(true, "RadioButton did not manupulate a local variable");
    });

    it("should react to change events", () => {
        const changeSpy = Sinon.spy(() => {
            radioButton.setProps({ checked: !radioButton.props().checked });
        });

        const radioButton = shallow(
            <RadioButton checked={false} label="Test" onChange={changeSpy} value="0" />
        );

        // expect(radioButton.props().checked).to.be.false;

        radioButton.find("input").simulate("change");
        expect(changeSpy.calledOnce).to.be.true;
        // expect(radioButton.props().checked).to.be.true;

        radioButton.find("input").simulate("change");
        expect(changeSpy.calledTwice).to.be.true;
        // expect(radioButton.props().checked).to.be.false;
    });

    it("should be able to change its value", () => {
        let checked = false;
        let value = 0;

        const changeSpy = Sinon.spy(() => {
            checked = !checked;
            value++;
            radioButton.setProps({
                checked,
                value,
            });
        });

        const radioButton = shallow(
            <RadioButton checked={false} label="Test" onChange={changeSpy} value={value} />
        );

        // expect(radioButton.props().checked).to.be.false;
        // expect(radioButton.props().value).to.be.equal(0);

        radioButton.find("input").simulate("change");
        expect(changeSpy.calledOnce).to.equal(true, "onclick was not called");
        // expect(radioButton.props().checked).to.be.equal(true, "buttons was not checked");
        // expect(radioButton.props().value).to.be.equal(1, "value was incremented");
        expect(value).to.be.equal(1, "local value was incremented");

        radioButton.find("input").simulate("change");
        expect(changeSpy.calledTwice).to.be.true;
        // expect(radioButton.props().checked).to.be.false;
        // expect(radioButton.props().value).to.be.equal(2);
        expect(value).to.be.equal(2);
    });
});
