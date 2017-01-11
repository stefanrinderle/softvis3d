import {observable} from "mobx";
import {district} from "../constants/Layouts";
import {defaultProfile, custom} from "../constants/Profiles";
import * as Metrics from "../constants/Metrics";
import {SelectOptionElement} from "../components/ui/SelectBox/SelectBoxBuilder";

class CityBuilderStore {

    @observable
    public layoutType: Layout = district;
    @observable
    public profile: Profile = defaultProfile;
    @observable
    public metricColor: Metric = Metrics.noMetric;
    @observable
    public availableColorMetrics: Metric[] = observable([]);
    @observable
    public renderButtonClicked: boolean = false;
    @observable
    public show: boolean = false;

    @observable
    private availableGenericMetrics: Metric[] = observable([]);

    public constructor() {
        this.availableGenericMetrics.push(Metrics.noMetric);
        this.availableColorMetrics = this.availableColorMetrics.concat([
            Metrics.noMetric,
            Metrics.complexityMetric,
            Metrics.coverageMetric,
            Metrics.violationMetric,
            Metrics.newIssuesMetric,
            Metrics.linesOfCodeMetric,
            Metrics.openIssuesMetric,
            Metrics.packageNameMetric
        ]);
    }

    public chooseEditableProfile() {
        this.profile = custom;
    }

    public setLayout(l: Layout) {
        this.layoutType = l;
    }

    public addGenericMetrics(metrics: Metric[]) {
        this.availableGenericMetrics = this.availableGenericMetrics.concat(metrics);
    }

    public getAvailableGenericMetrics(): Array<SelectOptionElement<Metric>> {
        return this.getSelectOptionMetric(this.availableGenericMetrics);
    }

    public getAvailableColorMetrics(): Array<SelectOptionElement<Metric>> {
        return this.getSelectOptionMetric(this.availableColorMetrics);
    }

    private getSelectOptionMetric(metric: Metric[]) {
        return metric.map((m) => ({key: m.key, label: m.name, value: m}));
    }
}

const cityBuilderStore = new CityBuilderStore();

export default cityBuilderStore;
export { CityBuilderStore };