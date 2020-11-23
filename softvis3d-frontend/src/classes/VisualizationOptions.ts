import {observable} from "mobx";
import {DEFAULT_BUILDING_COLOR_THEME} from "../constants/BuildingColorThemes";
import {evostreet} from "../constants/Layouts";
import {noColorMetric} from "../constants/Metrics";
import {defaultProfile} from "../constants/Profiles";
import {DEFAULT_COLOR_THEME} from "../constants/SceneColorThemes";
import BuildingColorTheme from "./BuildingColorTheme";
import Layout from "./Layout";
import Metric from "./Metric";
import Profile from "./Profile";
import {SceneColorTheme} from "./SceneColorTheme";

export default class VisualizationOptions {

    public static createDefault(): VisualizationOptions {
        return new VisualizationOptions(defaultProfile.clone(), evostreet, noColorMetric,
            DEFAULT_BUILDING_COLOR_THEME, DEFAULT_COLOR_THEME);
    }

    @observable
    public profile: Profile;
    @observable
    public layout: Layout;
    @observable
    public metricColor: Metric;
    @observable
    public buildingColorTheme: BuildingColorTheme;
    @observable
    public colorTheme: SceneColorTheme;

    constructor(profile: Profile, layout: Layout, metricColor: Metric,
                buildingColorTheme: BuildingColorTheme, colorTheme: SceneColorTheme) {
        this.profile = profile;
        this.layout = layout;
        this.metricColor = metricColor;
        this.buildingColorTheme = buildingColorTheme;
        this.colorTheme = colorTheme;
    }

    public equalStructure(candidate: VisualizationOptions | null): boolean {
        if (candidate) {
            return this.layout === candidate.layout
                && this.profile.footprintMetric === candidate.profile.footprintMetric
                && this.profile.heightMetric === candidate.profile.heightMetric
                && this.profile.scale === candidate.profile.scale;
        } else {
            return false;
        }
    }
}
