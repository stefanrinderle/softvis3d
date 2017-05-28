import * as React from "react";
import {assert, expect} from "chai";
import {shallow} from "enzyme";
import {CityBuilderStore} from "../../../src/stores/CityBuilderStore";
import TopBarMenu from "../../../src/components/topbar/TopBarMenu";
import VisualizationLinkService from "../../../src/services/VisualizationLinkService";
import TopBarShareButton from "../../../src/components/topbar/TopBarShareButton";
import * as Sinon from "sinon";

describe("<TopBarMenu/>", () => {

    it("should show settings button and check action", () => {
        let localCityBuilderStore: CityBuilderStore = Sinon.createStubInstance(CityBuilderStore);
        let localVisualizationLinkService = Sinon.createStubInstance(VisualizationLinkService);

        const topBarMenu = shallow(
            <TopBarMenu cityBuilderStore={localCityBuilderStore}
                        visualizationLinkService={localVisualizationLinkService}/>
        );

        const settingsButton = topBarMenu.find("#settings-button");

        settingsButton.simulate("click");
        expect(localCityBuilderStore.show).to.be.true;
    });

    it("should show feedback button and check action", () => {
        let localCityBuilderStore: CityBuilderStore = Sinon.createStubInstance(CityBuilderStore);
        let localVisualizationLinkService = Sinon.createStubInstance(VisualizationLinkService);

        let stub = Sinon.stub(window, "open");

        const topBarMenu = shallow(
            <TopBarMenu cityBuilderStore={localCityBuilderStore}
                        visualizationLinkService={localVisualizationLinkService}/>
        );

        const feedbackButton = topBarMenu.find("#feedback-button");
        feedbackButton.simulate("click");

        assert(stub.calledWithExactly("http://softvis3d.com/#/feedback"));

        stub.restore();
    });

    it("should show help button and check action", () => {
        let localCityBuilderStore: CityBuilderStore = Sinon.createStubInstance(CityBuilderStore);
        let localVisualizationLinkService = Sinon.createStubInstance(VisualizationLinkService);

        let stub = Sinon.stub(window, "open");

        const topBarMenu = shallow(
            <TopBarMenu cityBuilderStore={localCityBuilderStore}
                        visualizationLinkService={localVisualizationLinkService}/>
        );

        const helpButton = topBarMenu.find("#help-button");
        helpButton.simulate("click");

        assert(stub.calledWithExactly("http://softvis3d.com/#/help"));

        stub.restore();
    });

    it("should have share component", () => {
        let localCityBuilderStore: CityBuilderStore = Sinon.createStubInstance(CityBuilderStore);
        let localVisualizationLinkService = Sinon.createStubInstance(VisualizationLinkService);

        localCityBuilderStore.show = true;

        const topBarMenu = shallow(
            <TopBarMenu cityBuilderStore={localCityBuilderStore}
                        visualizationLinkService={localVisualizationLinkService}/>
        );

        expect(topBarMenu.contains(
            <TopBarShareButton disabled={true} visualizationLinkService={localVisualizationLinkService}/>)
        ).to.be.true;
    });
});