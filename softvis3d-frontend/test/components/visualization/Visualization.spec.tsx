import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import TopBar from "../../../src/components/topbar/TopBar";
import VisualizationComponent from "../../../src/components/visualization/VisualizationComponent";
import Scene from "../../../src/components/scene/Scene";
import BottomBar from "../../../src/components/bottombar/BottomBar";

describe("<VisualizationComponent/>", () => {

    it("should show nothing on start", () => {
        const visualization = shallow(
            <VisualizationComponent/>
        );

        expect(visualization.children().length).to.be.eq(3);
        expect(visualization.contains(<TopBar/>)).to.be.true;
        expect(visualization.contains(<Scene/>)).to.be.true;
        expect(visualization.contains(<BottomBar/>)).to.be.true;
    });

});