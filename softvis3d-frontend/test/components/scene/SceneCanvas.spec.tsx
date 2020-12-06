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

import SceneCanvas from "../../../src/components/scene/SceneCanvas";
import * as Sinon from "sinon";
import { assert } from "chai";
import { SceneMouseInteractions } from "../../../src/components/scene/events/SceneMouseInteractions";
import Event from "../../../src/components/scene/events/Event";

describe("<SceneCanvas/>", () => {
    it("should mount", () => {
        const stubMouseActions: any = Sinon.createStubInstance(SceneMouseInteractions);
        SceneMouseInteractions.create = Sinon.stub().returns(stubMouseActions);

        const underTest: SceneCanvas = new SceneCanvas();
        underTest.props = {
            selectObject: Sinon.spy(),
            updateCameraPosition: Sinon.spy(),
            updateSceneFocusState: Sinon.spy(),
        };

        underTest.componentDidMount();

        assert(stubMouseActions.addMouseDownEventListener.called);
        assert(stubMouseActions.addMouseMovedEventListener.called);
        assert(stubMouseActions.addSelectObjectEventEventListener.called);
    });

    it("should unmount", () => {
        const stubMouseActions: any = Sinon.createStubInstance(SceneMouseInteractions);
        SceneMouseInteractions.create = Sinon.stub().returns(stubMouseActions);

        const underTest: SceneCanvas = new SceneCanvas();
        underTest.props = {
            selectObject: Sinon.spy(),
            updateCameraPosition: Sinon.spy(),
            updateSceneFocusState: Sinon.spy(),
        };

        underTest.componentDidMount();
        underTest.componentWillUnmount();

        assert(stubMouseActions.destroy.called);
    });

    it("should handle mouse down event to focus", () => {
        const sceneFocusSpy = Sinon.spy();

        const underTest: SceneCanvas = new SceneCanvas();
        underTest.props = {
            selectObject: Sinon.spy(),
            updateCameraPosition: Sinon.spy(),
            updateSceneFocusState: sceneFocusSpy,
        };

        const testEvent: Event<boolean> = new Event(true);
        underTest.handleMouseDown(testEvent);

        assert(sceneFocusSpy.calledWith(true));
    });

    it("should handle mouse down event to unfocus", () => {
        const sceneFocusSpy = Sinon.spy();

        const underTest: SceneCanvas = new SceneCanvas();
        underTest.props = {
            selectObject: Sinon.spy(),
            updateCameraPosition: Sinon.spy(),
            updateSceneFocusState: sceneFocusSpy,
        };

        const testEvent: Event<boolean> = new Event(false);
        underTest.handleMouseDown(testEvent);

        assert(sceneFocusSpy.calledWith(false));
    });

    it("should handle mouse select event", () => {
        const selectObjectSpy = Sinon.spy();

        const underTest: SceneCanvas = new SceneCanvas();
        underTest.props = {
            selectObject: selectObjectSpy,
            updateCameraPosition: Sinon.spy(),
            updateSceneFocusState: Sinon.spy(),
        };

        const mouseEventStub = Sinon.createStubInstance(MouseEvent);
        const testEvent: Event<MouseEvent> = new Event(mouseEventStub);
        underTest.handleSelectObject(testEvent);

        assert(selectObjectSpy.calledWith(mouseEventStub));
    });
});
