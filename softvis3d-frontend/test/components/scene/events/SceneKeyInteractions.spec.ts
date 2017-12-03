import {assert} from "chai";
import * as Sinon from "sinon";
import {SceneKeyInteractions} from "../../../../src/components/scene/events/SceneKeyInteractions";

describe("SceneKeyInteractions", () => {

    it("should add and remove event listeners on object create or destruct.", () => {
        let windowStubAdd = Sinon.stub(window, "addEventListener");
        let windowStubRemove = Sinon.stub(window, "removeEventListener");

        let underTest: SceneKeyInteractions = SceneKeyInteractions.create();

        assert(windowStubAdd.calledOnce);
        assert(windowStubAdd.calledWith("keydown"));

        underTest.destroy();

        assert(windowStubRemove.calledOnce);
        assert(windowStubRemove.calledWith("keydown"));

        windowStubAdd.restore();
        windowStubRemove.restore();
    });

    it("should raise reset camera event on r button clicked.", () => {
        let underTest: SceneKeyInteractions = SceneKeyInteractions.create();

        const eventButtonR = { keyCode: 82 } as any as KeyboardEvent;

        let listener: Function = () => undefined;
        const spy = Sinon.spy(listener);

        underTest.addResetCameraEventListener(spy);

        underTest.handleKeyDown(eventButtonR);
        assert(spy.notCalled);

        underTest.resume();

        underTest.handleKeyDown(eventButtonR);
        assert(spy.calledOnce);
    });

    it("should raise toggle legend event on l button clicked.", () => {
        let underTest: SceneKeyInteractions = SceneKeyInteractions.create();

        const eventButtonL = { keyCode: 76 } as any as KeyboardEvent;

        let listener: Function = () => undefined;
        const spy = Sinon.spy(listener);

        underTest.addToggleLegendEventListener(spy);

        underTest.handleKeyDown(eventButtonL);
        assert(spy.notCalled);

        underTest.resume();

        underTest.handleKeyDown(eventButtonL);
        assert(spy.calledOnce);
    });

    it("should raise toggle color theme event on c button clicked.", () => {
        let underTest: SceneKeyInteractions = SceneKeyInteractions.create();

        const eventButtonC = { keyCode: 67 } as any as KeyboardEvent;

        let listener: Function = () => undefined;
        const spy = Sinon.spy(listener);

        underTest.addToggleColorThemeEventListener(spy);

        underTest.handleKeyDown(eventButtonC);
        assert(spy.notCalled);

        underTest.resume();

        underTest.handleKeyDown(eventButtonC);
        assert(spy.calledOnce);
    });

    it("should NOT raise toggle color theme event on c button clicked if inactive.", () => {
        let underTest: SceneKeyInteractions = SceneKeyInteractions.create();

        const eventButtonC = { keyCode: 67 } as any as KeyboardEvent;

        let listener: Function = () => undefined;
        const spy = Sinon.spy(listener);

        underTest.addToggleColorThemeEventListener(spy);

        underTest.resume();
        underTest.halt();

        underTest.handleKeyDown(eventButtonC);
        assert(spy.notCalled);
    });

    it("should NOT raise any event on other button clicked.", () => {
        let underTest: SceneKeyInteractions = SceneKeyInteractions.create();

        const eventButtonR = { keyCode: 4 } as any as KeyboardEvent;

        let listener: Function = () => undefined;
        const spy = Sinon.spy(listener);

        underTest.addResetCameraEventListener(spy);
        underTest.addToggleLegendEventListener(spy);

        underTest.handleKeyDown(eventButtonR);

        assert(spy.notCalled);
    });
});