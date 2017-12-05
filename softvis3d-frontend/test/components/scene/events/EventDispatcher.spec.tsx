import {assert, expect} from "chai";
import * as Sinon from "sinon";
import {EventDispatcher} from "../../../../src/components/scene/events/EventDispatcher";
import Event from "../../../../src/components/scene/events/Event";

describe("EventDispatcher", () => {

    it("should be able too add listener and get void events", () => {
        let underTest: EventDispatcher<void> = new EventDispatcher<void>();

        underTest.addEventListener(() => {
            expect(true).to.be.true;
        });

        let event: Event<void> = new Event<void>(undefined);
        underTest.dispatchEvent(event);
    });

    it("should be able too add listener and get string events", () => {
        let underTest: EventDispatcher<string> = new EventDispatcher<string>();

        let expectedResult: string = "oisudhf";
        underTest.addEventListener((result: Event<string>) => {
            expect(expectedResult).to.be.eq(result.getValue());
        });

        let event: Event<string> = new Event<string>(expectedResult);
        underTest.dispatchEvent(event);
    });

    it("should not be able to attach the same listener again", () => {
        let underTest: EventDispatcher<string> = new EventDispatcher<string>();

        let expectedResult: string = "oisudhf";
        let counter: number = 0;
        let listener: Function = (result: Event<string>) => {
            if (counter > 1) {
                expect(true).to.be.false;
            }
            expect(expectedResult).to.be.eq(result.getValue());
        };

        underTest.addEventListener(listener);
        underTest.addEventListener(listener);

        let event: Event<string> = new Event<string>(expectedResult);
        underTest.dispatchEvent(event);
    });

    it("should be able to remove a listener", () => {
        let underTest: EventDispatcher<string> = new EventDispatcher<string>();

        let expectedResult: string = "oisudhf";
        let listener: Function = (result: Event<string>) => {
                expect(true).to.be.eq(result);
        };

        underTest.addEventListener(listener);
        underTest.removeEventListener(listener);

        let event: Event<string> = new Event<string>(expectedResult);
        underTest.dispatchEvent(event);
    });

    it("should be able to attach more than one listener", () => {
        let underTest: EventDispatcher<string> = new EventDispatcher<string>();

        let expectedResult: string = "oisudhf";
        let listener1: Function = (result: Event<string>) => {
            expect(expectedResult).to.be.eq(result.getValue());
        };
        const spy1 = Sinon.spy(listener1);
        let listener2: Function = (result: Event<string>) => {
            expect(expectedResult).to.be.eq(result.getValue());
        };
        const spy2 = Sinon.spy(listener2);

        underTest.addEventListener(spy1);
        underTest.addEventListener(spy2);

        let event: Event<string> = new Event<string>(expectedResult);
        underTest.dispatchEvent(event);

        assert(spy1.calledOnce);
        assert(spy2.calledOnce);
    });
});