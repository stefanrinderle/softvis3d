///
/// softvis3d-frontend
/// Copyright (C) 2020 Stefan Rinderle and Yvo Niedrich
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

import { assert, expect } from "chai";
import * as Sinon from "sinon";
import { BufferGeometry, Color, MeshLambertMaterial, Scene } from "three";
import { SoftVis3dMesh } from "../../../../../src/components/scene/domain/SoftVis3dMesh";
import { SoftVis3dShape } from "../../../../../src/components/scene/domain/SoftVis3dShape";
import { ObjectFactory } from "../../../../../src/components/scene/visualization/objects/ObjectFactory";
import { Wrangler } from "../../../../../src/components/scene/visualization/objects/Wrangler";
import SceneStore from "../../../../../src/stores/SceneStore";
import { createMockInjection } from "../../../../Helper";

describe("Wrangler", () => {
    it("should load softvis shapes", () => {
        const scene = Sinon.createStubInstance(Scene);
        const underTest: Wrangler = new Wrangler();

        const shapes: SoftVis3dShape[] = [];

        const objectsInView: SoftVis3dMesh[] = [];
        objectsInView.push(createExampleMesh("1"));
        objectsInView.push(createExampleMesh("2"));
        objectsInView.push(createExampleMesh("3"));
        const objectFactoryMock = Sinon.stub(ObjectFactory, "getSceneObjects").returns(
            objectsInView
        );

        underTest.loadSoftVis3d(scene, shapes);

        assert(scene.add.calledThrice);

        objectFactoryMock.restore();
    });

    it("should remove existing softvis shapes on load", () => {
        const scene = Sinon.createStubInstance(Scene);

        const underTest: Wrangler = new Wrangler();

        const shapes: SoftVis3dShape[] = [];

        const objectsInView: SoftVis3dMesh[] = [];
        objectsInView.push(createExampleMesh("1"));
        const objectFactoryMock = Sinon.stub(ObjectFactory, "getSceneObjects").returns(
            objectsInView
        );

        underTest.loadSoftVis3d(scene, shapes);
        assert(scene.remove.notCalled);

        underTest.loadSoftVis3d(scene, shapes);

        assert(scene.remove.calledOnce);

        objectFactoryMock.restore();
    });

    it("should update the colors of the shapes 1", () => {
        createMockInjection(new SceneStore());

        const scene = Sinon.createStubInstance(Scene);

        const underTest: Wrangler = new Wrangler();

        const shapes: SoftVis3dShape[] = [];

        const objectsInView1: SoftVis3dMesh[] = [];
        const expectedColor1 = new Color(111111);
        objectsInView1.push(createExampleMesh("1", expectedColor1));

        const objectsInView2: SoftVis3dMesh[] = [];
        const expectedColor2 = new Color(777777);
        objectsInView2.push(createExampleMesh("1", expectedColor2));

        const objectFactoryMock = Sinon.stub(ObjectFactory, "getSceneObjects");
        objectFactoryMock.onFirstCall().returns(objectsInView1);
        objectFactoryMock.onSecondCall().returns(objectsInView2);

        underTest.loadSoftVis3d(scene, shapes);

        let resultObjects: SoftVis3dMesh[] = underTest.getObjectsInView();
        expect(resultObjects[0].material.color).to.be.eq(expectedColor1);

        underTest.updateColorsWithUpdatedShapes(shapes);

        resultObjects = underTest.getObjectsInView();

        expect(resultObjects[0].material.color).to.be.eq(expectedColor2);

        objectFactoryMock.restore();
    });

    it("should update the colors of the shapes 2", () => {
        createMockInjection(new SceneStore());

        const scene = Sinon.createStubInstance(Scene);

        const underTest: Wrangler = new Wrangler();

        const shapes: SoftVis3dShape[] = [];

        const objectsInView1: SoftVis3dMesh[] = [];
        objectsInView1.push(createExampleMesh("1"));

        const objectsInView2: SoftVis3dMesh[] = [];
        objectsInView2.push(createExampleMesh("1"));

        const objectFactoryMock = Sinon.stub(ObjectFactory, "getSceneObjects");
        objectFactoryMock.onFirstCall().returns(objectsInView1);
        objectFactoryMock.onSecondCall().returns(objectsInView2);

        underTest.loadSoftVis3d(scene, shapes);
        underTest.selectSceneTreeObject("1");
        underTest.updateColorsWithUpdatedShapes(shapes);

        const resultObjects = underTest.getObjectsInView();

        const selectedColor = new Color(0xffc519);
        expect(resultObjects[0].material.color.r).to.be.eq(selectedColor.r);
        expect(resultObjects[0].material.color.g).to.be.eq(selectedColor.g);
        expect(resultObjects[0].material.color.b).to.be.eq(selectedColor.b);

        objectFactoryMock.restore();
    });

    it("should select scene tree object", () => {
        const scene = Sinon.createStubInstance(Scene);

        const underTest: Wrangler = new Wrangler();

        const shapes: SoftVis3dShape[] = [];

        const objectsInView: SoftVis3dMesh[] = [];
        objectsInView.push(createExampleMesh("1"));
        objectsInView.push(createExampleMesh("2"));
        const objectFactoryMock = Sinon.stub(ObjectFactory, "getSceneObjects").returns(
            objectsInView
        );

        underTest.loadSoftVis3d(scene, shapes);

        underTest.selectSceneTreeObject("1");

        const resultObjects = underTest.getObjectsInView();

        const selectedColor = new Color(0xffc519);
        expect(resultObjects[0].material.color.r).to.be.eq(selectedColor.r);
        expect(resultObjects[0].material.color.g).to.be.eq(selectedColor.g);
        expect(resultObjects[0].material.color.b).to.be.eq(selectedColor.b);

        objectFactoryMock.restore();
    });

    it("should reset to former color on selectt object", () => {
        const scene = Sinon.createStubInstance(Scene);

        const underTest: Wrangler = new Wrangler();

        const shapes: SoftVis3dShape[] = [];

        const objectsInView: SoftVis3dMesh[] = [];
        const firstColor = new Color(0x222222);
        objectsInView.push(createExampleMesh("1", firstColor));
        objectsInView.push(createExampleMesh("2", firstColor));
        const objectFactoryMock = Sinon.stub(ObjectFactory, "getSceneObjects").returns(
            objectsInView
        );

        underTest.loadSoftVis3d(scene, shapes);

        underTest.selectSceneTreeObject("1");
        underTest.selectSceneTreeObject("2");

        const resultObjects = underTest.getObjectsInView();

        const selectedColor = new Color(0xffc519);
        expect(resultObjects[0].material.color.r).to.be.eq(firstColor.r);
        expect(resultObjects[0].material.color.g).to.be.eq(firstColor.g);
        expect(resultObjects[0].material.color.b).to.be.eq(firstColor.b);
        expect(resultObjects[1].material.color.r).to.be.eq(selectedColor.r);
        expect(resultObjects[1].material.color.g).to.be.eq(selectedColor.g);
        expect(resultObjects[1].material.color.b).to.be.eq(selectedColor.b);

        objectFactoryMock.restore();
    });

    it("should reset on destroy", () => {
        const scene = Sinon.createStubInstance(Scene);
        const underTest: Wrangler = new Wrangler();

        underTest.destroy(scene);

        expect(underTest.getObjectsInView()).to.be.deep.eq([]);
    });
});

function createExampleMesh(key: string, color?: Color): SoftVis3dMesh {
    const material = new MeshLambertMaterial();
    if (color) {
        material.color = color;
    }
    return new SoftVis3dMesh(key, new BufferGeometry(), material);
}
