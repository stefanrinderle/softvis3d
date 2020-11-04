import {observable} from "mobx";
import BuildingColorTheme from "../classes/BuildingColorTheme";
import Layout from "../classes/Layout";
import Metric from "../classes/Metric";
import MetricSet from "../classes/MetricSet";
import {PreviewPicture} from "../classes/PreviewPicture";
import Profile from "../classes/Profile";
import {DEFAULT_BUILDING_COLOR_THEME} from "../constants/BuildingColorThemes";
import {evostreet} from "../constants/Layouts";
import {ColorMetrics, noColorMetric, noMetricId} from "../constants/Metrics";
import {availablePreviewPictures, placeholder} from "../constants/PreviewPictures";
import {custom, defaultProfile, Profiles} from "../constants/Profiles";

class CityBuilderStore {

    @observable
    public layout: Layout = evostreet;
    @observable
    public metricColor: Metric = noColorMetric;
    @observable
    public readonly colorMetrics: MetricSet = new MetricSet(ColorMetrics.availableColorMetrics);
    @observable
    public buildingColorTheme: BuildingColorTheme = DEFAULT_BUILDING_COLOR_THEME;
    @observable
    public readonly genericMetrics: MetricSet = new MetricSet([]);
    @observable
    public initiateBuildProcess: boolean = false;
    @observable
    public show: boolean = true;

    @observable
    private _profile: Profile = defaultProfile.clone();
    private _customProfile: Profile = custom;

    set profile(p: Profile) {
        if (p.id === custom.id) {
            this._customProfile.updateConfiguration(
                this.profile.footprintMetricId, this.profile.heightMetricId, this.profile.scale);
            this._profile = this._customProfile;
        } else {
            this._profile = Profiles.getAvailableProfileById(p.id).clone();
        }
    }

    get profile(): Profile {
        return this._profile;
    }

    get heightMetric(): Metric {
        let result = this.genericMetrics.getMetricByKey(this._profile.heightMetricId);
        if (result === undefined) {
            return new Metric(noMetricId, " -- None -- ", "");
        } else {
            return result;
        }
    }

    get footprintMetric(): Metric {
        let result = this.genericMetrics.getMetricByKey(this._profile.footprintMetricId);
        if (result === undefined) {
            return new Metric(noMetricId, " -- None -- ", "");
        } else {
            return result;
        }
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
export {CityBuilderStore};