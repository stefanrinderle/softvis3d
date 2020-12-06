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

import {assert} from "chai";
import * as Sinon from "sinon";
import {SceneKeyInteractions} from "../../../../src/components/scene/events/SceneKeyInteractions";

describe("SceneKeyInteractions", () => {

    it("should add and remove event listeners on object create or destruct.", () => {
        const windowStubAdd = Sinon.stub(window, "addEventListener");
        const windowStubRemove = Sinon.stub(window, "removeEventListener");

        const underTest: SceneKeyInteractions = SceneKeyInteractions.create();

        assert(windowStubAdd.calledOnce);
        assert(windowStubAdd.calledWith("keydown"));

        underTest.destroy();

        assert(windowStubRemove.calledOnce);
        assert(windowStubRemove.calledWith("keydown"));

        windowStubAdd.restore();
        windowStubRemove.restore();
    });

    it("should raise reset camera event on r button clicked.", () => {
        const underTest: SceneKeyInteractions = SceneKeyInteractions.create();

        const eventButtonR = { keyCode: 82 } as any as KeyboardEvent;

        const listener: () => void = () => undefined;
        const spy = Sinon.spy(listener);

        underTest.addResetCameraEventListener(spy);

        underTest.handleKeyDown(eventButtonR);
        assert(spy.notCalled);

        underTest.resume();

        underTest.handleKeyDown(eventButtonR);
        assert(spy.calledOnce);
    });

    it("should raise toggle legend event on l button clicked.", () => {
        const underTest: SceneKeyInteractions = SceneKeyInteractions.create();

        const eventButtonL = { keyCode: 76 } as any as KeyboardEvent;

        const listener: () => void = () => undefined;
        const spy = Sinon.spy(listener);

        underTest.addToggleLegendEventListener(spy);

        underTest.handleKeyDown(eventButtonL);
        assert(spy.notCalled);

        underTest.resume();

        underTest.handleKeyDown(eventButtonL);
        assert(spy.calledOnce);
    });

    it("should NOT raise any event on other button clicked.", () => {
        const underTest: SceneKeyInteractions = SceneKeyInteractions.create();

        const eventButtonR = { keyCode: 4 } as any as KeyboardEvent;

        const listener: () => void = () => undefined;
        const spy = Sinon.spy(listener);

        underTest.addResetCameraEventListener(spy);
        underTest.addToggleLegendEventListener(spy);

        underTest.handleKeyDown(eventButtonR);

        assert(spy.notCalled);
    });
});