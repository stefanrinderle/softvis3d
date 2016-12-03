import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import TopBarComponent from "../../../src/components/topbar/TopBar";
import VisualizationComponent from "../../../src/components/visualization/VisualizationComponent";
import SceneComponent from "../../../src/components/scene/SceneComponent";

describe("<TopBarComponent/>", () => {

    it("should show nothing on start", () => {
        const visualization = shallow(
            <VisualizationComponent/>
        );

        expect(visualization.children().length).to.be.eq(2);
        expect(visualization.contains(<TopBarComponent/>)).to.be.true;
        expect(visualization.contains(<SceneComponent/>)).to.be.true;
    });

});