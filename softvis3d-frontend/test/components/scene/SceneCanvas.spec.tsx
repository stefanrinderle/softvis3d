import SceneCanvas from "../../../src/components/scene/SceneCanvas";
import * as Sinon from "sinon";
import { assert } from "chai";
import { SceneMouseInteractions } from "../../../src/components/scene/events/SceneMouseInteractions";
import Event from "../../../src/components/scene/events/Event";

describe("<SceneCanvas/>", () => {

    it("should mount", () => {
        let stubMouseActions: any = Sinon.createStubInstance(SceneMouseInteractions);
        SceneMouseInteractions.create = Sinon.stub().returns(stubMouseActions);

        let underTest: SceneCanvas = new SceneCanvas();
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
        let stubMouseActions: any = Sinon.createStubInstance(SceneMouseInteractions);
        SceneMouseInteractions.create = Sinon.stub().returns(stubMouseActions);

        let underTest: SceneCanvas = new SceneCanvas();
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
        let sceneFocusSpy = Sinon.spy();

        let underTest: SceneCanvas = new SceneCanvas();
        underTest.props = {
            selectObject: Sinon.spy(),
            updateCameraPosition: Sinon.spy(),
            updateSceneFocusState: sceneFocusSpy
        };

        let testEvent: Event<boolean> = new Event(true);
        underTest.handleMouseDown(testEvent);

        assert(sceneFocusSpy.called);
    });

    it("should handle mouse down event to unfocus", () => {
        let sceneFocusSpy = Sinon.spy();

        let underTest: SceneCanvas = new SceneCanvas();
        underTest.props = {
            selectObject: Sinon.spy(),
            updateCameraPosition: Sinon.spy(),
            updateSceneFocusState: sceneFocusSpy
        };

        let testEvent: Event<boolean> = new Event(false);
        underTest.handleMouseDown(testEvent);

        assert(sceneFocusSpy.called);
    });

});