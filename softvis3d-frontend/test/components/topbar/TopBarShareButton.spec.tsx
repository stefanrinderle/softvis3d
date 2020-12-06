import {assert, expect} from "chai";
import {mount} from "enzyme";
import * as React from "react";
import * as Sinon from "sinon";
import TopBarShareButton from "../../../src/components/topbar/TopBarShareButton";
import ClipBoardService from "../../../src/services/ClipBoardService";
import VisualizationLinkService from "../../../src/services/VisualizationLinkService";
import CityBuilderStore from "../../../src/stores/CityBuilderStore";
import SceneStore from "../../../src/stores/SceneStore";
import {createMock} from "../../Helper";

describe("<TopBarShareButton/>", () => {

    it("should initialize if disabled", () => {
        const localCityBuilderStore: CityBuilderStore = Sinon.createStubInstance(CityBuilderStore);
        const localSceneStore: SceneStore = Sinon.createStubInstance(SceneStore);

        createMock(VisualizationLinkService);

        const shareButton = mount(
            <TopBarShareButton disabled={false} cityBuilderStore={localCityBuilderStore} sceneStore={localSceneStore}/>
        );

        expect(shareButton.children("button").length).to.be.eq(1);

        expect(shareButton.children(".dropdown-menu").length).to.be.eq(1);
        expect(shareButton.children(".dropdown-menu.open").length).to.be.eq(0);

        expect(shareButton.state().isVisible).to.be.false;
    });

    it("should open visualization link", () => {
        const localCityBuilderStore: CityBuilderStore = Sinon.createStubInstance(CityBuilderStore);
        const localSceneStore: SceneStore = Sinon.createStubInstance(SceneStore);

        const localVisualizationLinkService = createMock(VisualizationLinkService);

        const stub = Sinon.stub(window, "open");

        localVisualizationLinkService.createVisualizationLink.returns("abc");

        const shareButton = mount(
            <TopBarShareButton disabled={true} cityBuilderStore={localCityBuilderStore} sceneStore={localSceneStore}/>
        );

        const dropDownButtons = shareButton.find(".dropdown-menu button");

        dropDownButtons.at(1).simulate("click");

        assert(stub.calledWithExactly("abc"));
        stub.restore();

        expect(shareButton.state().isVisible).to.be.false;
    });

    it("should copy visualization link", () => {
        const localCityBuilderStore: CityBuilderStore = Sinon.createStubInstance(CityBuilderStore);
        const localSceneStore: SceneStore = Sinon.createStubInstance(SceneStore);

        const localVisualizationLinkService = createMock(VisualizationLinkService);
        const localClipBoardService = createMock(ClipBoardService);

        localVisualizationLinkService.createVisualizationLink.returns("abc");

        const shareButton = mount(
            <TopBarShareButton disabled={true} cityBuilderStore={localCityBuilderStore} sceneStore={localSceneStore}/>
        );

        const dropDownButtons = shareButton.find(".dropdown-menu button");

        dropDownButtons.at(0).simulate("click");

        assert(localClipBoardService.copyTextToClipboard.calledWithExactly("abc"));

        expect(shareButton.state().isVisible).to.be.false;
    });
});