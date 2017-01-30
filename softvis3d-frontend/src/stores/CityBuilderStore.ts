import {observable} from "mobx";
import {district} from "../constants/Layouts";
import {defaultProfile, custom} from "../constants/Profiles";
import {noMetric, availableColorMetrics} from "../constants/Metrics";
import {placeholder, customEvostreet, customDistrict} from "../constants/PreviewPictures";
import MetricSet from "../classes/MetricSet";
import Metric from "../classes/Metric";
import Layout from "../classes/Layout";
import Profile from "../classes/Profile";
import {PreviewPicture} from "../classes/PreviewPicture";

class CityBuilderStore {

    @observable
    public layout: Layout = district;
    @observable
    public metricColor: Metric = noMetric;
    @observable
    public readonly colorMetrics: MetricSet = new MetricSet(availableColorMetrics);
    @observable
    public readonly genericMetrics: MetricSet = new MetricSet([]);
    @observable
    public initiateBuildProcess: boolean = false;
    @observable
    public show: boolean = false;

    @observable
    private _profile: Profile = defaultProfile;
    private previewPictures: PreviewPicture[] = [];

    public constructor() {
        this.previewPictures = [
            customDistrict,
            customEvostreet
        ];
    }

    set profile(p: Profile) {
        if (p.id === custom.id) {
            p.metricHeight = this.profile.metricHeight;
            p.metricWidth = this.profile.metricWidth;
        }
        this._profile = p;
    }

    get profile(): Profile {
        return this._profile;
    }

    public getPreviewBackground(): PreviewPicture {
        for (let preview of this.previewPictures) {
            if (preview.forLayout(this.layout) && preview.forProfile(this.profile)) {
                return preview;
            }
        }

        return placeholder;
    }
}

const cityBuilderStore = new CityBuilderStore();

export default cityBuilderStore;
export { CityBuilderStore };