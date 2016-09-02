import {Shape, Vector2} from "three";

export class SoftVis3dShape extends Shape {

    public key: string;

    constructor(points?: Vector2[]) {
        super(points);
    }
}