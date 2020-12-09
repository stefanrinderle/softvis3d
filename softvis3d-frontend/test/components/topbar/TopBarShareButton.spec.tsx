///
/// softvis3d-frontend
/// Copyright (C) 2020 Stefan Rinderle and Yvo Niedrich
/// stefan@rinderle.info / yvo.niedrich@gmail.com
///
/// This program is free software; you can redistribute it and/or
/// modify it under the terms of the GNU Lesser General Public
/// License as published by the Free Software Foundation; either
/// version 3 of the License, or (at your option) any later version.
///
/// This program is distributed in the hope that it will be useful,
/// but WITHOUT ANY WARRANTY; without even the implied warranty of
/// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
/// Lesser General Public License for more details.
///
/// You should have received a copy of the GNU Lesser General Public
/// License along with this program; if not, write to the Free Software
/// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
///

import { assert, expect } from "chai";
import { mount } from "enzyme";
import * as React from "react";
import * as Sinon from "sinon";
import TopBarShareButton from "../../../src/components/topbar/TopBarShareButton";
import ClipBoardService from "../../../src/services/ClipBoardService";
import VisualizationLinkService from "../../../src/services/VisualizationLinkService";
import { createMock } from "../../Helper";

describe("<TopBarShareButton/>", () => {
    it("should initialize if disabled", () => {
        createMock(VisualizationLinkService);

        const shareButton = mount(<TopBarShareButton disabled={false} />);

        expect(shareButton.children("button").length).to.be.eq(1);

        expect(shareButton.children(".dropdown-menu").length).to.be.eq(1);
        expect(shareButton.children(".dropdown-menu.open").length).to.be.eq(0);

        expect(shareButton.state().isVisible).to.be.false;
    });

    it("should open visualization link", () => {
        const localVisualizationLinkService = createMock(VisualizationLinkService);

        const stub = Sinon.stub(window, "open");

        localVisualizationLinkService.createVisualizationLink.returns("abc");

        const shareButton = mount(<TopBarShareButton disabled={true} />);

        const dropDownButtons = shareButton.find(".dropdown-menu button");

        dropDownButtons.at(1).simulate("click");

        assert(stub.calledWithExactly("abc"));
        stub.restore();

        expect(shareButton.state().isVisible).to.be.false;
    });

    it("should copy visualization link", () => {
        const localVisualizationLinkService = createMock(VisualizationLinkService);
        const localClipBoardService = createMock(ClipBoardService);

        localVisualizationLinkService.createVisualizationLink.returns("abc");

        const shareButton = mount(<TopBarShareButton disabled={true} />);

        const dropDownButtons = shareButton.find(".dropdown-menu button");

        dropDownButtons.at(0).simulate("click");

        assert(localClipBoardService.copyTextToClipboard.calledWithExactly("abc"));

        expect(shareButton.state().isVisible).to.be.false;
    });
});
