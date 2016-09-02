import {Mesh, Geometry, Material} from "three";

export class SoftVis3dMesh extends Mesh {

    private softVis3dId: string;

    constructor(softVis3dId: string, geometry?: Geometry, material?: Material) {
        super(geometry, material);

        this.softVis3dId = softVis3dId;
    }

    public getSoftVis3dId(): string {
        return this.softVis3dId;
    }
}