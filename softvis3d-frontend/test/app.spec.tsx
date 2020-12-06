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

import { assert } from "chai";
import App from "../src/app";
import * as Sinon from "sinon";
import * as ReactDOM from "react-dom";

describe("App", () => {
    it("should unmount component on stop", () => {
        const documentMock = ({} as any) as Document;
        const documentStub = Sinon.stub(document, "getElementById");
        documentStub.returns(documentMock);

        const reactDOMStub = Sinon.stub(ReactDOM, "unmountComponentAtNode");

        const underTest: App = new App({
            baseUrl: "/",
            projectKey: "",
            isDev: false,
        });

        underTest.stop("bla");

        assert(reactDOMStub.calledWith(documentMock));

        reactDOMStub.restore();
        documentStub.restore();
    });

    it("should throw error on unmount component on stop with invalid target", () => {
        const underTest: App = new App({
            baseUrl: "/",
            projectKey: "",
            isDev: false,
        });

        assert.throws(() => {
            underTest.stop("not existing");
        });
    });
});
