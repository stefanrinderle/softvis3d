import { observable } from "mobx";
import Layout, { district } from "../classes/Layout";

class CityBuilderConfig {
    @observable public layoutType: Layout;
    @observable public metricColor: string;
    @observable public metricHeight: string;
    @observable public metricWidth: string;
    @observable public availableMetrics: Array<Metric>;

    public constructor() {
        this.layoutType = district;
        this.metricColor = "";
        this.metricHeight = "";
        this.metricWidth = "";
        this.availableMetrics = [];
    }

    public setLayout(layout: Layout) {
        this.layoutType = layout;
    }

    public addAvailableMetrics(metrics: Array<Metric>) {
        this.availableMetrics = this.availableMetrics.concat(metrics);
    }
}

const cityBuilderConfig = new CityBuilderConfig();

export default cityBuilderConfig;
export { CityBuilderConfig };