import {observable, computed} from "mobx";
import {district} from "../dtos/Layouts";
import {demo} from "../dtos/Profiles";
import * as Actions from "../events/EventConstants";
import appStatusStore from "./AppStatusStore";

class CityBuilderStore {
    @observable public layoutType: Layout;
    @observable public profile: Profile;
    @observable public metricColor: string;
    @observable public metricHeight: string;
    @observable public metricWidth: string;
    @observable public availableMetrics: Metric[];
    private show: boolean;

    public constructor() {
        this.show = false;
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

    public handleEvents(event: SoftvisEvent) {
        switch (event.type) {
            case Actions.INIT_APP:
            case Actions.SHOW_BUILDER:
                this.show = true;
                break;
            case Actions.SCENE_CREATE:
                this.show = false;
                break;
            default:
                break;
        }
    }
}

const cityBuilderStore = new CityBuilderStore();

export default cityBuilderStore;
export { CityBuilderStore };