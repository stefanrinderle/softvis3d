import {observable, computed} from "mobx";
import {TreeService} from "../services/TreeService";
import {district} from "../constants/Layouts";
import * as Metrics from "../constants/Metrics";
import Metric from "../classes/Metric";
import Layout from "../classes/Layout";
import SoftVis3dScene from "../components/scene/visualization/SoftVis3dScene";
import Scale from "../classes/Scale";
import {LOGARITHMIC} from "../constants/Scales";

class SceneStore {
    @observable
    public layout: Layout = district;
    @observable
    public metricWidth: Metric = Metrics.noMetric;
    @observable
    public metricHeight: Metric = Metrics.noMetric;
    @observable
    public metricColor: Metric = Metrics.noMetric;
    @observable
    public scale: Scale = LOGARITHMIC;
    @observable
    public legacyData: TreeElement | null = null;
    @observable
    public selectedObjectId: string | null = null;
    @observable
    public shapes: any = null;
    @observable
    public refreshScene: boolean = false;
    @observable
    public sceneComponentIsMounted: boolean = false;

    public scenePainter: SoftVis3dScene;

    public constructor() {
        this.scenePainter = new SoftVis3dScene();
    }

    @computed
    public get isVisible() {
        return this.shapes !== null;
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

    public getColorValue(): number | null {
        if (this.selectedElement && this.selectedElement.measures
                && this.metricColor.key in this.selectedElement.measures) {
            return this.selectedElement.measures[this.metricColor.key];
        } else {
            return null;
        }
    }
}

const sceneStore = new SceneStore();

export default sceneStore;
export { SceneStore };