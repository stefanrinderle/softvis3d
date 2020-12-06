import {computed, observable, observe} from "mobx";
import {Vector3} from "three";
import Metric from "../classes/Metric";
import {TreeElement} from "../classes/TreeElement";
import {lazyInject} from "../inversify.config";
import TreeService from "../services/TreeService";

export default class SceneStore {

    @observable
    public projectData: TreeElement | null = null;
    @observable
    public selectedObjectId: string | null = null;
    @observable
    public shapes: any = null;
    @observable
    public shapesHash = "";

    public cameraPosition?: Vector3;
    public scmMetricLoaded: boolean;

    @lazyInject("TreeService")
    private readonly treeService!: TreeService;

    public constructor() {
        this.scmMetricLoaded = false;
        observe(this, "shapes", () => { this.shapesHash = (Date.now()).toString(36); });
    }

    @computed
    public get isVisible() {
        return this.shapes !== null;
    }

    @computed
    public get selectedElement(): TreeElement | null {
        let selectedElement: TreeElement | null = null;
        if (this.projectData !== null && this.selectedObjectId != null) {
            selectedElement =
                this.treeService.searchTreeNode(this.projectData, this.selectedObjectId);
        }
        return selectedElement;
    }

    public getColorValue(metric: Metric): number | null {
        if (this.selectedElement && this.selectedElement.measures
                && metric.id in this.selectedElement.measures) {
            return this.selectedElement.measures[metric.id];
        } else {
            return null;
        }
    }
}