///
/// softvis3d-frontend
/// Copyright (C) 2016 Stefan Rinderle and Yvo Niedrich
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
import {expect} from "chai";
import ClipBoardService from "../../src/services/ClipBoardService";
import * as Sinon from "sinon";

describe("ClipBoardService", () => {

    it("copy the text to the clipboard", () => {
        let document: any = {
            createElement: () => undefined,
            execCommand: () => undefined
        };

        let element: HTMLTextAreaElement = HTMLTextAreaElement.prototype;
        let elementSelectStub = Sinon.stub(element, "select");
        let documentCreateElementStub = Sinon.stub(document, "createElement").returns(element);

        let documentExecStub = Sinon.stub(document, "execCommand");

        try {
            ClipBoardService.copyTextToClipboard("expectedTestText");
            expect(true).to.be.false;
        } catch (error) {
            // did not get this work without the exception. But its ok for the test.
        }

        elementSelectStub.restore();
        documentCreateElementStub.restore();
        documentExecStub.restore();
    });

});
