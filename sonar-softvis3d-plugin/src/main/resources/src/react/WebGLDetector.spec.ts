import { expect } from "chai";
import {WebGLDetector} from "./WebGLDetector";

describe("WebGLDetector", () => {

    it("webGL is not supported without mocks", () => {
        expect(WebGLDetector.isWebGLSupported()).to.be.equal(false);
    });

});
