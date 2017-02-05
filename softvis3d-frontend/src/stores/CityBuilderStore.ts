import {observable} from "mobx";
import Layout from "../classes/Layout";
import {district} from "../constants/Layouts";
import Metric from "../classes/Metric";
import {noMetric, availableColorMetrics} from "../constants/Metrics";
import MetricSet from "../classes/MetricSet";
import Profile from "../classes/Profile";
import {defaultProfile, custom, Profiles} from "../constants/Profiles";
import {PreviewPicture} from "../classes/PreviewPicture";
import {placeholder, availablePreviewPictures} from "../constants/PreviewPictures";

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
    private _profile: Profile = defaultProfile.clone();
    private _customProfile: Profile = custom;

    set profile(p: Profile) {
        if (p.id === custom.id) {
            this._customProfile.updateConfiguration(this.profile.metricWidth, this.profile.metricHeight, this.profile.scale);
            this._profile = this._customProfile;
        } else {
            this._profile = Profiles.getAvailableProfileById(p.id).clone();
        }
    }

    get profile(): Profile {
        return this._profile;
    }

    public getPreviewBackground(): PreviewPicture {
        for (let preview of availablePreviewPictures) {
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