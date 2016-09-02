import {expect} from "chai";
import {ObjectFactory} from "./ObjectFactory";
import {SoftVis3dShape} from "./domain/SoftVis3dShape";
import {SoftVis3dMesh} from "./domain/SoftVis3dMesh";
import {Vector2} from "three";

describe("ObjectFactory", () => {

    it("should return emtpy list", () => {
        let input: SoftVis3dShape[] = [];
        let result: SoftVis3dMesh[] = ObjectFactory.getSceneObjects(input);

        expect(result.length).to.be.equal(0);
    });

    it("should return single mesh", () => {
        let expected: string = "123";

        let input: SoftVis3dShape[] = [];
        input.push(createExampleShape(expected));

        let result: SoftVis3dMesh[] = ObjectFactory.getSceneObjects(input);

        expect(result.length).to.be.equal(1);
        let mesh: SoftVis3dMesh = result[0];
        expect(mesh.getSoftVis3dId()).to.be.equal(expected);
    });

    it("should return multiple mesh", () => {
        let expected1: string = "1";
        let expected2: string = "2";

        let input: SoftVis3dShape[] = [];
        input.push(createExampleShape(expected1));
        input.push(createExampleShape(expected2));

        let result: SoftVis3dMesh[] = ObjectFactory.getSceneObjects(input);

        expect(result.length).to.be.equal(2);
        expect(result[0].getSoftVis3dId()).to.be.equal(expected1);
        expect(result[1].getSoftVis3dId()).to.be.equal(expected2);
    });

});

function createExampleShape(key: string): SoftVis3dShape {
    let vectors: Vector2[] = [];
    vectors.push(new Vector2(1, 2));
    let shape: SoftVis3dShape = new SoftVis3dShape(vectors);
    shape.key = key;

    return shape;
}