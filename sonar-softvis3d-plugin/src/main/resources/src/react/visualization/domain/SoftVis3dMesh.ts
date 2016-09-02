import {Mesh, Geometry, MeshLambertMaterial} from "three";

export class SoftVis3dMesh extends Mesh {

    /**
     * @Override material from Mesh
     *
     * package private in Mesh, public here.
     * Override to provide MeshLambertMaterial instead of Material
     */
    public material: MeshLambertMaterial;

    private softVis3dId: string;

    constructor(softVis3dId: string, geometry?: Geometry, material?: MeshLambertMaterial) {
        super(geometry, material);

        this.material = material;
        this.softVis3dId = softVis3dId;
    }

    public getSoftVis3dId(): string {
        return this.softVis3dId;
    }

}