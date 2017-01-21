import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import LoadingImage from "../../../../src/components/status/loading/LoadingImage";

describe("<LoadingImage/>", () => {

    it("should draw logo with text", () => {
        const softvis3d = shallow(
            <LoadingImage />
        );

        expect(softvis3d.html()).to.include("Loading...");
    });

});