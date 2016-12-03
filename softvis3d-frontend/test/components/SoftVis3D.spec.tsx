import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import Softvis3D from "../../src/components/Softvis3D";
import appStatusStore from "../../src/stores/AppStatusStore";
import Status from "../../src/components/Status";
import cityBuilderStore from "../../src/stores/CityBuilderStore";
import CityBuilder from "../../src/components/CityBuilder/CityBuilder";
import sceneStore from "../../src/stores/SceneStore";
import VisualizationComponent from "../../src/components/visualization/VisualizationComponent";

describe("<SoftVis3D/>", () => {

    it("should show nothing on start", () => {
        const softvis3d = shallow(
            <Softvis3D/>
        );

        expect(softvis3d.contains(<Status/>)).to.be.false;
        expect(softvis3d.contains(<CityBuilder store={cityBuilderStore}/>)).to.be.false;
        expect(softvis3d.contains(<VisualizationComponent/>)).to.be.false;
    });

    // TODO: Changes of the stores here have side effects on other tests.
    // We should find a way to solve this. How can the sores be mocked?

    it("should show loader on state change", () => {
        appStatusStore.loadingQueue = ['eins'];

        const softvis3d = shallow(
            <Softvis3D/>
        );

        expect(softvis3d.contains(<Status/>)).to.be.true;
    });

    it("should show builder on state change", () => {

        appStatusStore.loadingQueue = [];
        cityBuilderStore.show = true;

        const softvis3d = shallow(
            <Softvis3D/>
        );

        expect(softvis3d.contains(<CityBuilder store={cityBuilderStore}/>)).to.be.true;
    });

    it("should show scene on state change", () => {
        sceneStore.shapes = [];

        const softvis3d = shallow(
            <Softvis3D/>
        );

        expect(softvis3d.contains(<VisualizationComponent/>)).to.be.true;
    });

});