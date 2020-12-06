import {assert, expect} from "chai";
import * as Sinon from "sinon";
import {EventDispatcher} from "../../../../src/components/scene/events/EventDispatcher";
import Event from "../../../../src/components/scene/events/Event";

describe("EventDispatcher", () => {

    it("should be able too add listener and get void events", () => {
        const underTest: EventDispatcher<void> = new EventDispatcher<void>();

        underTest.addEventListener(() => {
            expect(true).to.be.true;
        });

        const event: Event<void> = new Event<void>(undefined);
        underTest.dispatchEvent(event);
    });

    it("should be able too add listener and get string events", () => {
        const underTest: EventDispatcher<string> = new EventDispatcher<string>();

        const expectedResult = "oisudhf";
        underTest.addEventListener((result: Event<string>) => {
            expect(expectedResult).to.be.eq(result.getValue());
        });

        const event: Event<string> = new Event<string>(expectedResult);
        underTest.dispatchEvent(event);
    });

    it("should not be able to attach the same listener again", () => {
        const underTest: EventDispatcher<string> = new EventDispatcher<string>();

        const expectedResult = "oisudhf";
        const counter = 0;
        const listener: (result: Event<string>) => void = (result: Event<string>) => {
            if (counter > 1) {
                expect(true).to.be.false;
            }
            expect(expectedResult).to.be.eq(result.getValue());
        };

        underTest.addEventListener(listener);
        underTest.addEventListener(listener);

        const event: Event<string> = new Event<string>(expectedResult);
        underTest.dispatchEvent(event);
    });

    it("should be able to remove a listener", () => {
        const underTest: EventDispatcher<string> = new EventDispatcher<string>();

        const expectedResult = "oisudhf";
        const listener: (result: Event<string>) => void = (result: Event<string>) => {
                expect(true).to.be.eq(result);
        };

        underTest.addEventListener(listener);
        underTest.removeEventListener(listener);

        const event: Event<string> = new Event<string>(expectedResult);
        underTest.dispatchEvent(event);
    });

    it("should be able to attach more than one listener", () => {
        const underTest: EventDispatcher<string> = new EventDispatcher<string>();

        const expectedResult = "oisudhf";
        const listener1: (result: Event<string>) => void = (result: Event<string>) => {
            expect(expectedResult).to.be.eq(result.getValue());
        };
        const spy1 = Sinon.spy(listener1);
        const listener2: (result: Event<string>) => void = (result: Event<string>) => {
            expect(expectedResult).to.be.eq(result.getValue());
        };
        const spy2 = Sinon.spy(listener2);

        underTest.addEventListener(spy1);
        underTest.addEventListener(spy2);

        const event: Event<string> = new Event<string>(expectedResult);
        underTest.dispatchEvent(event);

        assert(spy1.calledOnce);
        assert(spy2.calledOnce);
    });
});