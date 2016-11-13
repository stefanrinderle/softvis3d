import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import TopBar from "../../src/components/TopBar";

describe("<TopBar/>", () => {
    it("smoke test", () => {

        const topBar = shallow(
            <TopBar/>
        );

        expect(topBar.find("h1")).to.have.length(1);
    });

});