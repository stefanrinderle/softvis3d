import {observable} from "mobx";
import {CityBuilderTab} from "../classes/CityBuilderTab";
import Metric from "../classes/Metric";
import MetricSet from "../classes/MetricSet";
import {PreviewPicture} from "../classes/PreviewPicture";
import Profile from "../classes/Profile";
import VisualizationOptions from "../classes/VisualizationOptions";
import {ColorMetrics} from "../constants/Metrics";
import {availablePreviewPictures, placeholder} from "../constants/PreviewPictures";
import {custom, Profiles} from "../constants/Profiles";

export default class CityBuilderStore {

    @observable
    public options: VisualizationOptions = VisualizationOptions.createDefault();

    @observable
    public readonly colorMetrics: MetricSet = new MetricSet(ColorMetrics.availableColorMetrics);
    @observable
    public readonly genericMetrics: MetricSet = new MetricSet([]);
    @observable
    public initiateBuildProcess: boolean = false;
    @observable
    public show: boolean = true;
    @observable
    public currentTab: CityBuilderTab = CityBuilderTab.Default;

    private _customProfile: Profile = custom;

    public setProfile(p: Profile) {
        if (p.id === custom.id) {
            this._customProfile.updateConfiguration(
                this.options.profile.footprintMetric, this.options.profile.heightMetric, this.options.profile.scale);
            this.options.profile = this._customProfile;
        } else {
            this.options.profile = Profiles.getAvailableProfileById(p.id).clone();
        }
    }

    get heightMetric(): Metric {
        return this.options.profile.heightMetric;
    }

    get footprintMetric(): Metric {
        return this.options.profile.footprintMetric;
    }

    public getPreviewBackground(): PreviewPicture {
        for (let preview of availablePreviewPictures) {
            if (preview.forLayout(this.options.layout) && preview.forProfile(this.options.profile)) {
                return preview;
            }
        }

        return placeholder;
    }
}