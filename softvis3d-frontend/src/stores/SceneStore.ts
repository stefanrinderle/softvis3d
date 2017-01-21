import {observable, computed, reaction} from "mobx";
import {TreeService} from "../services/TreeService";
import {defaultProfile} from "../constants/Profiles";
import {district} from "../constants/Layouts";
import * as Metrics from "../constants/Metrics";
import Metric from "../constants/Metric";
import {Profile} from "../constants/Profile";

class SceneStore {

    @observable
    public sceneLayoutType: Layout = district;
    @observable
    public sceneProfile: Profile = defaultProfile;
    @observable
    public sceneMetricColor: Metric = Metrics.noMetric;

    @observable
    public legacyData: TreeElement | null = null;

    @observable
    public selectedObjectId: string | null = null;

    @observable
    private currentShapes: any;

    private shapesUpdate: boolean = false;

    @observable
    private rendered: boolean = false;

    private mouseMoved: boolean = false;

    public constructor() {
        this.rendered = false;

        reaction(
            "Render the threeJS scene as soon as data is available",
            () => this.currentShapes,
            () => { this.rendered = true; }
        );
    }

    public setSelectedObjectId(objectId: string | null) {
        this.selectedObjectId = objectId;
    }

    public setShapes(shapes: any) {
        this.shapesUpdate = false;
        this.currentShapes = shapes;
    }

    public updateShapes(shapes: any) {
        this.shapesUpdate = true;
        this.currentShapes = shapes;
    }

    public getShapes() {
        return this.currentShapes;
    }

    public isShapesUpdate() {
        return this.shapesUpdate;
    }

    @computed
    public get isVisible() {
        return this.rendered;
    }

    @computed
    public get selectedElement(): TreeElement | null {
        let selectedElement: TreeElement | null = null;
        if (this.legacyData !== null && this.selectedObjectId != null) {
            selectedElement =
                TreeService.searchTreeNode(this.legacyData, this.selectedObjectId);
        }
        return selectedElement;
    }

    public hasMouseMoved(): boolean {
        return this.mouseMoved;
    }

    public setMoved() {
        this.mouseMoved = true;
    }

    public resetMoved() {
        this.mouseMoved = false;
    }

    public getColorValue(): number | null {
        if (this.selectedElement && this.selectedElement.measures
                && sceneStore.sceneMetricColor.key in this.selectedElement.measures) {
            return this.selectedElement.measures[sceneStore.sceneMetricColor.key];
        } else {
            return null;
        }
    }
}

const sceneStore = new SceneStore();

export default sceneStore;
export { SceneStore };