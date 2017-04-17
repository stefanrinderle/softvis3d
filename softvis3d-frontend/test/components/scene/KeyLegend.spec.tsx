import * as React from "react";
import {expect} from "chai";
import {mount} from "enzyme";
import {KeyLegend} from "../../../src/components/scene/KeyLegend";

describe("<KeyLegend/>", () => {

    it("should initialize and be visible on true", () => {
        let scene = mount(
            <KeyLegend show={true}/>
        );

        expect(scene.html()).to.include("table");
    });

    it("should initialize and NOT be visible on false", () => {
        let scene = mount(
            <KeyLegend show={false}/>
        );

        expect(scene.html()).to.be.eq("<div></div>");
    });
});