import {observable} from "mobx";
import {district} from "../constants/Layouts";
import {defaultProfile, custom} from "../constants/Profiles";
import * as Metrics from "../constants/Metrics";
import {availableColorMetrics} from "../constants/Metrics";
import {placeholder, customEvostreet, customDistrict} from "../constants/PreviewPictures";
import MetricSet from "../constants/MetricSet";
import Metric from "../constants/Metric";
import {Profile} from "../constants/Profile";
import {PreviewPicture} from "../constants/PreviewPicture";

class CityBuilderStore {

    @observable
    public layoutType: Layout = district;
    @observable
    public profile: Profile = defaultProfile;
    @observable
    public metricColor: Metric = Metrics.noMetric;
    @observable
    public availableColorMetrics: MetricSet = new MetricSet(availableColorMetrics);
    @observable
    public renderButtonClicked: boolean = false;
    @observable
    public show: boolean = false;
    @observable
    private availableGenericMetrics: MetricSet;
    private previewPictures: PreviewPicture[] = [];

    public constructor() {
        this.previewPictures = [
            customDistrict,
            customEvostreet
        ];
    }

    public chooseEditableProfile() {
        this.setProfile(custom);
    }

    public setLayout(l: Layout) {
        this.layoutType = l;
    }

    public setProfile(p: Profile) {
        if (p.id === custom.id) {
            p.metricHeight = this.profile.metricHeight;
            p.metricWidth = this.profile.metricWidth;
        }

        this.profile = p;
    }

    public addGenericMetrics(metrics: Metric[]) {
        if (this.availableGenericMetrics) {
            this.availableGenericMetrics.addMetrics(metrics);
        } else {
            this.availableGenericMetrics = new MetricSet(metrics);
        }
    }

    public getPreviewBackground(): PreviewPicture {
        for (let preview of this.previewPictures) {
            if (preview.forLayout(this.layoutType) && preview.forProfile(this.profile)) {
                return preview;
            }
        }

        return placeholder;
    }

    public getAvailableGenericMetrics(): SelectOptionValue[] {
        if (this.availableGenericMetrics) {
            return this.availableGenericMetrics.getSelectOptions();
        } else {
            return [];
        }
    }

    public getAvailableColorMetrics(): SelectOptionValue[] {
        return this.availableColorMetrics.getSelectOptions();
    }

}

const cityBuilderStore = new CityBuilderStore();

export default cityBuilderStore;
export { CityBuilderStore };