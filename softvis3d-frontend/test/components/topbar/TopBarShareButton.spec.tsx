import {assert, expect} from "chai";
import {mount} from "enzyme";
import * as React from "react";
import * as Sinon from "sinon";
import TopBarShareButton from "../../../src/components/topbar/TopBarShareButton";
import ClipBoardService from "../../../src/services/ClipBoardService";
import VisualizationLinkService from "../../../src/services/VisualizationLinkService";
import {bindMock} from "../../Helper";

describe("<TopBarShareButton/>", () => {

    it("should initialize if disabled", () => {
        let localVisualizationLinkService = Sinon.createStubInstance(VisualizationLinkService);
        bindMock("VisualizationLinkService", localVisualizationLinkService);

        const shareButton = mount(
            <TopBarShareButton disabled={false}/>
        );

        expect(shareButton.children("button").length).to.be.eq(1);

        expect(shareButton.children(".dropdown-menu").length).to.be.eq(1);
        expect(shareButton.children(".dropdown-menu.open").length).to.be.eq(0);

        expect(shareButton.state().isVisible).to.be.false;
    });

    it("should open visualization link", () => {
        let localVisualizationLinkService = Sinon.createStubInstance(VisualizationLinkService);
        bindMock("VisualizationLinkService", localVisualizationLinkService);

        let stub = Sinon.stub(window, "open");

        localVisualizationLinkService.createVisualizationLink.returns("abc");

        const shareButton = mount(
            <TopBarShareButton disabled={true}/>
        );

        const dropDownButtons = shareButton.find(".dropdown-menu button");

        dropDownButtons.at(1).simulate("click");

        assert(stub.calledWithExactly("abc"));
        stub.restore();

        expect(shareButton.state().isVisible).to.be.false;
    });

    it("should copy visualization link", () => {
        let localVisualizationLinkService = Sinon.createStubInstance(VisualizationLinkService);
        bindMock("VisualizationLinkService", localVisualizationLinkService);

        let stub = Sinon.stub(ClipBoardService, "copyTextToClipboard");

        localVisualizationLinkService.createVisualizationLink.returns("abc");

        const shareButton = mount(
            <TopBarShareButton disabled={true}/>
        );

        const dropDownButtons = shareButton.find(".dropdown-menu button");

        dropDownButtons.at(0).simulate("click");

        assert(stub.calledWithExactly("abc"));
        stub.restore();

        expect(shareButton.state().isVisible).to.be.false;
    });
});