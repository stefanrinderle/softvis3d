import {assert, expect} from "chai";
import * as Sinon from "sinon";
import Event from "../../../../src/components/scene/events/Event";
import {SceneMouseInteractions} from "../../../../src/components/scene/events/SceneMouseInteractions";
import {HtmlDom} from "../../../../src/services/HtmlDom";

describe("SceneMouseInteractions", () => {

    it("should add and remove event listeners on object create or destruct.", () => {
        let windowStubAdd = Sinon.stub(window, "addEventListener");
        let windowStubRemove = Sinon.stub(window, "removeEventListener");

        let underTest: SceneMouseInteractions = SceneMouseInteractions.create();

        assert(windowStubAdd.calledOnce);
        assert(windowStubAdd.calledWith("mousedown"));

        underTest.destroy();

        assert(windowStubRemove.calledOnce);
        assert(windowStubRemove.calledWith("mousedown"));

        windowStubAdd.restore();
        windowStubRemove.restore();
    });

    it("should raise mouse down event on click on descendant.", () => {
        let underTest: SceneMouseInteractions = SceneMouseInteractions.create();

        const eventClickScene = { target: null } as any as MouseEvent;

        let listener: Function = (result: Event<boolean>) => {
            expect(result.getValue()).to.be.true;
        };
        const spy = Sinon.spy(listener);

        underTest.addMouseDownEventListener(spy);

        let htmlDomStub = Sinon.stub(HtmlDom, "isDescendant").returns(true);

        underTest.handleMouseDown(eventClickScene);

        assert(spy.calledOnce);

        htmlDomStub.restore();
    });

    it("should raise mouse down event on click on descendant.", () => {
        let underTest: SceneMouseInteractions = SceneMouseInteractions.create();

        let listener: Function = (result: Event<boolean>) => {
            expect(result.getValue()).to.be.true;
        };
        const spy = Sinon.spy(listener);

        underTest.addMouseDownEventListener(spy);

        let htmlDomStub = Sinon.stub(HtmlDom, "isDescendant").returns(false);

        const documentMock = { } as any as Document;
        let documentStub = Sinon.stub(document, "getElementById");
        documentStub.returns(documentMock);

        const eventClickScene = { target: documentMock } as any as MouseEvent;

        underTest.handleMouseDown(eventClickScene);

        assert(spy.calledOnce);

        htmlDomStub.restore();
    });

    it("should raise mouse down event with false on click if not in scene.", () => {
        let underTest: SceneMouseInteractions = SceneMouseInteractions.create();

        let listener: Function = (result: Event<boolean>) => {
            expect(result.getValue()).to.be.false;
        };
        const spy = Sinon.spy(listener);

        let htmlDomStub = Sinon.stub(HtmlDom, "isDescendant").returns(false);

        underTest.addMouseDownEventListener(spy);
        const eventClickScene = { target: "" } as any as MouseEvent;

        underTest.handleMouseDown(eventClickScene);

        assert(spy.calledOnce);

        htmlDomStub.restore();
    });

    it("should raise mouse moved event on mouse up and not moved.", () => {
        let underTest: SceneMouseInteractions = SceneMouseInteractions.create();

        let listener1: Function = () => undefined;
        const spy1 = Sinon.spy(listener1);
        let listener2: Function = () => undefined;
        const spy2 = Sinon.spy(listener2);

        underTest.addMouseMovedEventListener(spy1);
        underTest.addSelectObjectEventEventListener(spy2);
        const event = { target: "" } as any as MouseEvent;

        underTest.setMouseMoved(true);
        underTest.onMouseUp(event);

        assert(spy1.calledOnce);
        assert(spy2.notCalled);
    });

    it("should raise select object event on mouse up and moved.", () => {
        let underTest: SceneMouseInteractions = SceneMouseInteractions.create();

        let listener1: Function = () => undefined;
        const spy1 = Sinon.spy(listener1);
        let listener2: Function = () => undefined;
        const spy2 = Sinon.spy(listener2);

        underTest.addMouseMovedEventListener(spy1);
        underTest.addSelectObjectEventEventListener(spy2);
        const event = { target: "" } as any as MouseEvent;

        underTest.setMouseMoved(false);
        underTest.onMouseUp(event);

        assert(spy1.calledOnce);
        assert(spy2.calledOnce);
    });

});