import {assert} from "chai";
import App from "../src/app";
import * as Sinon from "sinon";
import * as ReactDOM from "react-dom";

describe("App", () => {

    it("should unmount component on stop", () => {
        const documentMock = {} as any as Document;
        const documentStub = Sinon.stub(document, "getElementById");
        documentStub.returns(documentMock);

        const reactDOMStub = Sinon.stub(ReactDOM, "unmountComponentAtNode");

        const underTest: App = new App({
            baseUrl: "/",
            projectKey: "",
            isDev: false
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
            isDev: false
        });

        assert.throws(() => {
            underTest.stop("not existing");
        });
    });

});