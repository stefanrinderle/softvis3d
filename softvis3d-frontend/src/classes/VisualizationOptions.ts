import {Type} from "class-transformer";
import {observable} from "mobx";
import {DEFAULT_BUILDING_COLOR_THEME} from "../constants/BuildingColorThemes";
import {evostreet} from "../constants/Layouts";
import {noColorMetric} from "../constants/Metrics";
import {defaultProfile} from "../constants/Profiles";
import {DEFAULT_COLOR_THEME} from "../constants/SceneColorThemes";
import BuildingColorTheme from "./BuildingColorTheme";
import FileFilter from "./FileFilter";
import Layout from "./Layout";
import Metric from "./Metric";
import Profile from "./Profile";
import {SceneColorTheme} from "./SceneColorTheme";

export default class VisualizationOptions {

    public static createDefault(): VisualizationOptions {
        return new VisualizationOptions(defaultProfile.clone(), evostreet, noColorMetric,
            DEFAULT_BUILDING_COLOR_THEME, DEFAULT_COLOR_THEME, new FileFilter());
    }

    @Type(() => Profile)
    @observable
    public profile: Profile;
    @Type(() => Layout)
    @observable
    public layout: Layout;
    @Type(() => Metric)
    @observable
    public metricColor: Metric;
    @Type(() => BuildingColorTheme)
    @observable
    public buildingColorTheme: BuildingColorTheme;
    @Type(() => SceneColorTheme)
    @observable
    public colorTheme: SceneColorTheme;
    @Type(() => FileFilter)
    public fileFilter: FileFilter;

    constructor(profile: Profile, layout: Layout, metricColor: Metric,
                buildingColorTheme: BuildingColorTheme, colorTheme: SceneColorTheme,
                fileFilter: FileFilter) {
        this.profile = profile;
        this.layout = layout;
        this.metricColor = metricColor;
        this.buildingColorTheme = buildingColorTheme;
        this.colorTheme = colorTheme;
        this.fileFilter = fileFilter;
    }

    public equalStructure(candidate: VisualizationOptions | null): boolean {
        if (candidate) {
            return this.layout.id === candidate.layout.id
                && this.profile.footprintMetric === candidate.profile.footprintMetric
                && this.profile.heightMetric === candidate.profile.heightMetric
                && this.profile.scale === candidate.profile.scale;
        } else {
            return false;
        }
    }
}
