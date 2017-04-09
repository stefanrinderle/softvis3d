import {assert} from "chai";
import {SceneKeyInteractions} from "../../../src/components/scene/SceneKeyInteractions";
import * as Sinon from "sinon";

describe("SceneKeyInteractions", () => {

    it("should add and remove event listeners on object create or destruct.", () => {
        let windowStubAdd = Sinon.stub(window, "addEventListener");
        let windowStubRemove = Sinon.stub(window, "removeEventListener");

        let underTest: SceneKeyInteractions = new SceneKeyInteractions();

        assert(windowStubAdd.calledOnce);
        assert(windowStubAdd.calledWith("keydown"));

        underTest.unmount();

        assert(windowStubRemove.calledOnce);
        assert(windowStubRemove.calledWith("keydown"));

        windowStubAdd.restore();
        windowStubRemove.restore();
    });

    it("should raise reset camera event on r button clicked.", () => {
        let underTest: SceneKeyInteractions = new SceneKeyInteractions();

        const eventButtonR = { keyCode: 82 } as any as KeyboardEvent;

        let listener: Function = () => { };
        const spy = Sinon.spy(listener);

        underTest.onResetCameraEvent.addEventListener(spy);

        underTest.handleKeyDown(eventButtonR);

        assert(spy.calledOnce);
    });

    it("should raise toggle legend event on l button clicked.", () => {
        let underTest: SceneKeyInteractions = new SceneKeyInteractions();

        const eventButtonR = { keyCode: 76 } as any as KeyboardEvent;

        let listener: Function = () => { };
        const spy = Sinon.spy(listener);

        underTest.onToggleLegendEvent.addEventListener(spy);

        underTest.handleKeyDown(eventButtonR);

        assert(spy.calledOnce);
    });

    it("should NOT raise any event on other button clicked.", () => {
        let underTest: SceneKeyInteractions = new SceneKeyInteractions();

        const eventButtonR = { keyCode: 4 } as any as KeyboardEvent;

        let listener: Function = () => { };
        const spy = Sinon.spy(listener);

        underTest.onResetCameraEvent.addEventListener(spy);
        underTest.onToggleLegendEvent.addEventListener(spy);

        underTest.handleKeyDown(eventButtonR);

        assert(spy.notCalled);
    });
});