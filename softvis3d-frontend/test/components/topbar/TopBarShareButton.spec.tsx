import * as React from "react";
import {expect, assert} from "chai";
import {mount} from "enzyme";
import VisualizationLinkService from "../../../src/services/VisualizationLinkService";
import TopBarShareButton from "../../../src/components/topbar/TopBarShareButton";
import {SceneStore} from "../../../src/stores/SceneStore";
import {CityBuilderStore} from "../../../src/stores/CityBuilderStore";
import * as Sinon from "sinon";
import ClipBoardService from "../../../src/services/ClipBoardService";

describe("<TopBarShareButton/>", () => {

    it("should initialize if disabled", () => {
        let localCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let localSceneStore: SceneStore = new SceneStore();
        let localVisualizationLinkService = new VisualizationLinkService(localCityBuilderStore, localSceneStore);

        const shareButton = mount(
            <TopBarShareButton disabled={false} visualizationLinkService={localVisualizationLinkService}/>
        );

        expect(shareButton.children("button").length).to.be.eq(1);

        expect(shareButton.children(".dropdown-menu").length).to.be.eq(1);
        expect(shareButton.children(".dropdown-menu-open").length).to.be.eq(0);

        expect(shareButton.state().isVisible).to.be.false;
    });

    it("should open visualization link", () => {
        let localCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let localSceneStore: SceneStore = new SceneStore();
        let localVisualizationLinkService = new VisualizationLinkService(localCityBuilderStore, localSceneStore);

        let stub = Sinon.stub(window, "open");

        Sinon.stub(localVisualizationLinkService, "createVisualizationLink").returns("abc");

        const shareButton = mount(
            <TopBarShareButton disabled={true} visualizationLinkService={localVisualizationLinkService}/>
        );

        const dropDownButtons = shareButton.find("span");

        dropDownButtons.at(1).simulate("click");

        assert(stub.calledWithExactly("abc"));
        stub.restore();

        expect(shareButton.state().isVisible).to.be.false;
    });

    it("should copy visualization link", () => {
        let localCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let localSceneStore: SceneStore = new SceneStore();
        let localVisualizationLinkService = new VisualizationLinkService(localCityBuilderStore, localSceneStore);

        let stub = Sinon.stub(ClipBoardService, "copyTextToClipboard");

        Sinon.stub(localVisualizationLinkService, "createVisualizationLink").returns("abc");

        const shareButton = mount(
            <TopBarShareButton disabled={true} visualizationLinkService={localVisualizationLinkService}/>
        );

        const dropDownButtons = shareButton.find("span");

        dropDownButtons.at(0).simulate("click");

        assert(stub.calledWithExactly("abc"));
        stub.restore();

        expect(shareButton.state().isVisible).to.be.false;
    });
});