import { observable } from "mobx";
import {district} from "../dtos/Layouts";
import {demo} from "../dtos/Profiles";

class CityBuilderStore {
    @observable public layoutType: Layout;
    @observable public profile: Profile;
    @observable public metricColor: string;
    @observable public metricHeight: string;
    @observable public metricWidth: string;
    @observable public availableMetrics: Metric[];

    public constructor() {
        this.layoutType = district;
        this.metricColor = "none";
        this.metricHeight = "none";
        this.metricWidth = "none";
        this.setProfile(demo);

        this.availableMetrics = observable([]);
        this.availableMetrics.push({
            id: "-1",
            key: "none",
            type: "NONE",
            name: " -- None -- "
        });
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