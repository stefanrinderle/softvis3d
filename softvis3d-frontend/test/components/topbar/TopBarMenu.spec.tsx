import {assert, expect} from "chai";
import {shallow} from "enzyme";
import * as React from "react";
import * as Sinon from "sinon";
import TopBarMenu from "../../../src/components/topbar/TopBarMenu";
import TopBarShareButton from "../../../src/components/topbar/TopBarShareButton";
import CityBuilderStore from "../../../src/stores/CityBuilderStore";
import SceneStore from "../../../src/stores/SceneStore";

describe("<TopBarMenu/>", () => {

    it("should show settings button and check action", () => {
        const localCityBuilderStore: CityBuilderStore = Sinon.createStubInstance(CityBuilderStore);
        const localSceneStore: SceneStore = Sinon.createStubInstance(SceneStore);

        const topBarMenu = shallow(
            <TopBarMenu cityBuilderStore={localCityBuilderStore} sceneStore={localSceneStore}/>
        );

        const settingsButton = topBarMenu.find("#settings-button");

        settingsButton.simulate("click");
        expect(localCityBuilderStore.show).to.be.true;
    });

    it("should show feedback button and check action", () => {
        const localCityBuilderStore: CityBuilderStore = Sinon.createStubInstance(CityBuilderStore);
        const localSceneStore: SceneStore = Sinon.createStubInstance(SceneStore);

        const stub = Sinon.stub(window, "open");

        const topBarMenu = shallow(
            <TopBarMenu cityBuilderStore={localCityBuilderStore} sceneStore={localSceneStore}/>
        );

        const feedbackButton = topBarMenu.find("#feedback-button");
        feedbackButton.simulate("click");

        assert(stub.calledWithExactly("http://softvis3d.com/#/feedback"));

        stub.restore();
    });

    it("should show help button and check action", () => {
        const localCityBuilderStore: CityBuilderStore = Sinon.createStubInstance(CityBuilderStore);
        const localSceneStore: SceneStore = Sinon.createStubInstance(SceneStore);

        const stub = Sinon.stub(window, "open");

        const topBarMenu = shallow(
            <TopBarMenu cityBuilderStore={localCityBuilderStore} sceneStore={localSceneStore}/>
        );

        const helpButton = topBarMenu.find("#help-button");
        helpButton.simulate("click");

        assert(stub.calledWithExactly("http://softvis3d.com/#/help"));

        stub.restore();
    });

    it("should have share component", () => {
        const localCityBuilderStore: CityBuilderStore = Sinon.createStubInstance(CityBuilderStore);
        const localSceneStore: SceneStore = Sinon.createStubInstance(SceneStore);

        localCityBuilderStore.show = true;

        const topBarMenu = shallow(
            <TopBarMenu cityBuilderStore={localCityBuilderStore} sceneStore={localSceneStore}/>
        );

        expect(topBarMenu.contains(
            <TopBarShareButton disabled={true} cityBuilderStore={localCityBuilderStore} sceneStore={localSceneStore}/>)
        ).to.be.true;
    });
});