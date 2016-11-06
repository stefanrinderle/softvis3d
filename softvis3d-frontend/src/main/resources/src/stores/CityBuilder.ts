import { observable } from "mobx";
import Layout, {district} from "../classes/Layout";
import Profile, {demo} from "../classes/Profile";

class CityBuilderConfig {
    @observable public layoutType: Layout;
    @observable public profile: Profile;
    @observable public metricColor: string;
    @observable public metricHeight: string;
    @observable public metricWidth: string;
    @observable public availableMetrics: Array<Metric>;

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
        console.log("New Profile:", p.name);
        this.profile = p;
        this.metricColor = p.metricColor || this.metricColor;
        this.metricHeight = p.metricHeight || this.metricHeight;
        this.metricWidth = p.metricWidth || this.metricWidth;
    }

    public setLayout(l: Layout) {
        this.layoutType = l;
    }

    public addAvailableMetrics(metrics: Array<Metric>) {
        this.availableMetrics = this.availableMetrics.concat(metrics);
    }
}

const cityBuilderConfig = new CityBuilderConfig();

interface MyWindow extends Window { store: any; }
(window as MyWindow).store = cityBuilderConfig;

export default cityBuilderConfig;
export { CityBuilderConfig };