import {observable, computed} from "mobx";
import {district} from "../dtos/Layouts";
import {demo, custom} from "../dtos/Profiles";
import appStatusStore from "./AppStatusStore";
import * as Metrics from "../dtos/Metrics";

class CityBuilderStore {
    @observable
    public layoutType: Layout;
    @observable
    public profile: Profile;
    @observable
    public metricColor: Metric;
    @observable
    public metricHeight: Metric;
    @observable
    public metricWidth: Metric;
    @observable
    public scalingMethod: string;
    @observable
    public availableGenericMetrics: Metric[];
    @observable
    public availableColorMetrics: Metric[];

    @observable
    public renderButtonClicked: boolean;
    @observable
    public show: boolean;

    public constructor() {
        this.show = false;
        this.renderButtonClicked = false;

        this.layoutType = district;
        this.scalingMethod = "linear_s";
        this.metricColor = Metrics.noMetric;
        this.metricHeight = Metrics.noMetric;
        this.metricWidth = Metrics.noMetric;
        this.setProfile(demo);

        this.availableGenericMetrics = observable([]);
        this.availableGenericMetrics.push(Metrics.noMetric);

        this.availableColorMetrics = observable([]);
        this.availableColorMetrics.push(Metrics.noMetric);
        this.addColorMetrics([
            Metrics.complexityMetric,
            Metrics.coverageMetric,
            Metrics.violationMetric,
            Metrics.newIssuesMetric,
            Metrics.linesOfCodeMetric,
            Metrics.openIssuesMetric,
            Metrics.packageNameMetric
        ]);
    }

    @computed
    public get isVisible() {
        return this.show && !appStatusStore.isVisible;
    }

    public chooseEditableProfile() {
        this.setProfile(custom);
    }

    public setProfile(p: Profile) {
        this.profile = p;
        this.metricHeight = p.metricHeight || this.metricHeight;
        this.metricWidth = p.metricWidth || this.metricWidth;
    }

    public setLayout(l: Layout) {
        this.layoutType = l;
    }

    public addGenericMetrics(metrics: Metric[]) {
        this.availableGenericMetrics = this.availableGenericMetrics.concat(metrics);
    }

    public addColorMetrics(metrics: Metric[]) {
        this.availableColorMetrics = this.availableColorMetrics.concat(metrics);
    }
}

const cityBuilderStore = new CityBuilderStore();

export default cityBuilderStore;
export { CityBuilderStore };