import {observable, computed} from "mobx";
import {district} from "../dtos/Layouts";
import {demo} from "../dtos/Profiles";
import appStatusStore from "./AppStatusStore";
import {noMetric} from "../dtos/Metrics";

class CityBuilderStore {
    @observable public layoutType: Layout;
    @observable public profile: Profile;
    @observable public metricColor: Metric;
    @observable public metricHeight: Metric;
    @observable public metricWidth: Metric;
    @observable public availableMetrics: Metric[];
    @observable public renderButtonClicked: boolean = false;
    @observable public show: boolean;

    public constructor() {
        this.show = false;
        this.layoutType = district;
        this.metricColor = noMetric;
        this.metricHeight = noMetric;
        this.metricWidth = noMetric;
        this.setProfile(demo);

        this.availableMetrics = observable([]);
        this.availableMetrics.push(noMetric);
    }

    @computed public get isVisible() {
        return this.show && !appStatusStore.isVisible;
    }

    public setProfile(p: Profile) {
        this.profile = p;
        this.metricColor = p.metricColor || this.metricColor;
        this.metricHeight = p.metricHeight || this.metricHeight;
        this.metricWidth = p.metricWidth || this.metricWidth;
    }

    public setLayout(l: Layout) {
        this.layoutType = l;
    }

    public addAvailableMetrics(metrics: Metric[]) {
        this.availableMetrics = this.availableMetrics.concat(metrics);
    }
}

const cityBuilderStore = new CityBuilderStore();

export default cityBuilderStore;
export { CityBuilderStore };