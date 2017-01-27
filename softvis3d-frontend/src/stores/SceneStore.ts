import {observable, computed} from "mobx";
import {TreeService} from "../services/TreeService";
import {defaultProfile} from "../constants/Profiles";
import {district} from "../constants/Layouts";
import * as Metrics from "../constants/Metrics";
import Metric from "../constants/Metric";
import {Profile} from "../constants/Profile";

class SceneStore {
    @observable
    public layout: Layout = district;
    @observable
    public profile: Profile = defaultProfile;
    @observable
    public metricColor: Metric = Metrics.noMetric;
    @observable
    public legacyData: TreeElement | null = null;
    @observable
    public selectedObjectId: string | null = null;
    @observable
    public shapes: any;
    @observable
    public refreshScene: boolean = false;

    public constructor() {
        this.shapes = null;
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