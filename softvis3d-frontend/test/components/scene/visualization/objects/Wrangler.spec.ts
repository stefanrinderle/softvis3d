///
/// softvis3d-frontend
/// Copyright (C) 2016 Stefan Rinderle and Yvo Niedrich
/// stefan@rinderle.info / yvo.niedrich@gmail.com
///
/// This program is free software; you can redistribute it and/or
/// modify it under the terms of the GNU Lesser General Public
/// License as published by the Free Software Foundation; either
/// version 3 of the License, or (at your option) any later version.
///
/// This program is distributed in the hope that it will be useful,
/// but WITHOUT ANY WARRANTY; without even the implied warranty of
/// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
/// Lesser General Public License for more details.
///
/// You should have received a copy of the GNU Lesser General Public
/// License along with this program; if not, write to the Free Software
/// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
///

import {assert, expect} from "chai";
import {Wrangler} from "../../../../../src/components/scene/visualization/objects/Wrangler";
import * as Sinon from "sinon";
import {SoftVis3dShape} from "../../../../../src/components/scene/domain/SoftVis3dShape";
import {Color, Geometry, MeshLambertMaterial, Scene} from "three";
import {ObjectFactory} from "../../../../../src/components/scene/visualization/objects/ObjectFactory";
import {SoftVis3dMesh} from "../../../../../src/components/scene/domain/SoftVis3dMesh";

describe("Wrangler", () => {

    it("should load softvis shapes", () => {
        let scene = Sinon.createStubInstance(Scene);
        let underTest: Wrangler = new Wrangler(scene);

        let shapes: SoftVis3dShape[] = [];

        let objectsInView: SoftVis3dMesh[] = [];
        objectsInView.push(createExampleMesh("1"));
        objectsInView.push(createExampleMesh("2"));
        objectsInView.push(createExampleMesh("3"));
        let objectFactoryMock = Sinon.stub(ObjectFactory, "getSceneObjects").returns(objectsInView);

        underTest.loadSoftVis3d(shapes);

        assert(scene.add.calledThrice);

        objectFactoryMock.restore();
    });

    it("should remove existing softvis shapes on load", () => {
        let scene = Sinon.createStubInstance(Scene);

        let underTest: Wrangler = new Wrangler(scene);

        let shapes: SoftVis3dShape[] = [];

        let objectsInView: SoftVis3dMesh[] = [];
        objectsInView.push(createExampleMesh("1"));
        let objectFactoryMock = Sinon.stub(ObjectFactory, "getSceneObjects").returns(objectsInView);

        underTest.loadSoftVis3d(shapes);
        assert(scene.remove.notCalled);

        underTest.loadSoftVis3d(shapes);

        assert(scene.remove.calledOnce);

        objectFactoryMock.restore();
    });

    it("should update the colors of the shapes", () => {
        let scene = Sinon.createStubInstance(Scene);

        let underTest: Wrangler = new Wrangler(scene);

        let shapes: SoftVis3dShape[] = [];

        let objectsInView1: SoftVis3dMesh[] = [];
        let expectedColor1 = new Color(111111);
        objectsInView1.push(createExampleMesh("1", expectedColor1));

        let objectsInView2: SoftVis3dMesh[] = [];
        let expectedColor2 = new Color(777777);
        objectsInView2.push(createExampleMesh("1", expectedColor2));

        let objectFactoryMock = Sinon.stub(ObjectFactory, "getSceneObjects");
        objectFactoryMock.onFirstCall().returns(objectsInView1);
        objectFactoryMock.onSecondCall().returns(objectsInView2);

        underTest.loadSoftVis3d(shapes);

        let resultObjects: SoftVis3dMesh[] = underTest.getObjectsInView();
        expect(resultObjects[0].material.color).to.be.eq(expectedColor1);

        underTest.updateColorsWithUpdatedShapes(shapes);

        resultObjects = underTest.getObjectsInView();

        expect(resultObjects[0].material.color).to.be.eq(expectedColor2);

        objectFactoryMock.restore();
    });

    it("should update the colors of the shapes", () => {
        let scene = Sinon.createStubInstance(Scene);

        let underTest: Wrangler = new Wrangler(scene);

        let shapes: SoftVis3dShape[] = [];

        let objectsInView1: SoftVis3dMesh[] = [];
        objectsInView1.push(createExampleMesh("1"));

        let objectsInView2: SoftVis3dMesh[] = [];
        objectsInView2.push(createExampleMesh("1"));

        let objectFactoryMock = Sinon.stub(ObjectFactory, "getSceneObjects");
        objectFactoryMock.onFirstCall().returns(objectsInView1);
        objectFactoryMock.onSecondCall().returns(objectsInView2);

        underTest.loadSoftVis3d(shapes);
        underTest.selectSceneTreeObject("1");
        underTest.updateColorsWithUpdatedShapes(shapes);

        let resultObjects = underTest.getObjectsInView();

        let selectedColor = new Color(0xFFC519);
        expect(resultObjects[0].material.color.r).to.be.eq(selectedColor.r);
        expect(resultObjects[0].material.color.g).to.be.eq(selectedColor.g);
        expect(resultObjects[0].material.color.b).to.be.eq(selectedColor.b);

        objectFactoryMock.restore();
    });

    it("should select scene tree object", () => {
        let scene = Sinon.createStubInstance(Scene);

        let underTest: Wrangler = new Wrangler(scene);

        let shapes: SoftVis3dShape[] = [];

        let objectsInView: SoftVis3dMesh[] = [];
        objectsInView.push(createExampleMesh("1"));
        objectsInView.push(createExampleMesh("2"));
        let objectFactoryMock = Sinon.stub(ObjectFactory, "getSceneObjects").returns(objectsInView);

        underTest.loadSoftVis3d(shapes);

        underTest.selectSceneTreeObject("1");

        let resultObjects = underTest.getObjectsInView();

        let selectedColor = new Color(0xFFC519);
        expect(resultObjects[0].material.color.r).to.be.eq(selectedColor.r);
        expect(resultObjects[0].material.color.g).to.be.eq(selectedColor.g);
        expect(resultObjects[0].material.color.b).to.be.eq(selectedColor.b);

        objectFactoryMock.restore();
    });

    it("should reset to former color on selectt object", () => {
        let scene = Sinon.createStubInstance(Scene);

        let underTest: Wrangler = new Wrangler(scene);

        let shapes: SoftVis3dShape[] = [];

        let objectsInView: SoftVis3dMesh[] = [];
        let firstColor = new Color(0x222222);
        objectsInView.push(createExampleMesh("1", firstColor));
        objectsInView.push(createExampleMesh("2", firstColor));
        let objectFactoryMock = Sinon.stub(ObjectFactory, "getSceneObjects").returns(objectsInView);

        underTest.loadSoftVis3d(shapes);

        underTest.selectSceneTreeObject("1");
        underTest.selectSceneTreeObject("2");

        let resultObjects = underTest.getObjectsInView();

        let selectedColor = new Color(0xFFC519);
        expect(resultObjects[0].material.color.r).to.be.eq(firstColor.r);
        expect(resultObjects[0].material.color.g).to.be.eq(firstColor.g);
        expect(resultObjects[0].material.color.b).to.be.eq(firstColor.b);
        expect(resultObjects[1].material.color.r).to.be.eq(selectedColor.r);
        expect(resultObjects[1].material.color.g).to.be.eq(selectedColor.g);
        expect(resultObjects[1].material.color.b).to.be.eq(selectedColor.b);

        objectFactoryMock.restore();
    });

    it("should reset on destroy", () => {
        let scene = Sinon.createStubInstance(Scene);
        let underTest: Wrangler = new Wrangler(scene);

        underTest.destroy();

        expect(underTest.getObjectsInView()).to.be.deep.eq([]);
    });
});

function createExampleMesh(key: string, color?: Color): SoftVis3dMesh {
    let material = new MeshLambertMaterial();
    if (color) {
        material.color = color;
    }
    return new SoftVis3dMesh(key, new Geometry(), material);
}