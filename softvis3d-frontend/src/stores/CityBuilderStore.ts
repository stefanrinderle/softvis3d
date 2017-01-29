import {observable} from "mobx";
import {district} from "../constants/Layouts";
import {defaultProfile, custom} from "../constants/Profiles";
import {noMetric, availableColorMetrics} from "../constants/Metrics";
import {placeholder, availablePreviewPictures} from "../constants/PreviewPictures";
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
    public metricColor: Metric = noMetric;
    @observable
    public readonly colorMetrics: MetricSet = new MetricSet(availableColorMetrics);
    @observable
    public readonly genericMetrics: MetricSet = new MetricSet([]);
    @observable
    public renderButtonClicked: boolean = false;
    @observable
    public show: boolean = false;

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

    public getPreviewBackground(): PreviewPicture {
        for (let preview of availablePreviewPictures) {
            if (preview.forLayout(this.layoutType) && preview.forProfile(this.profile)) {
                return preview;
            }
        }

        return placeholder;
    }
}

const cityBuilderStore = new CityBuilderStore();

export default cityBuilderStore;
export { CityBuilderStore };