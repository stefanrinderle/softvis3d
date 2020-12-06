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
            updateSceneFocusState: Sinon.spy()
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
            updateSceneFocusState: Sinon.spy()
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
            updateSceneFocusState: sceneFocusSpy
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
            updateSceneFocusState: sceneFocusSpy
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
            updateSceneFocusState: Sinon.spy()
        };

        const mouseEventStub = Sinon.createStubInstance(MouseEvent);
        const testEvent: Event<MouseEvent> = new Event(mouseEventStub);
        underTest.handleSelectObject(testEvent);

        assert(selectObjectSpy.calledWith(mouseEventStub));
    });

});