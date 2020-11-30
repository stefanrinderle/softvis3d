import {observable} from "mobx";
import {DEFAULT_BUILDING_COLOR_THEME} from "../constants/BuildingColorThemes";
import {evostreet} from "../constants/Layouts";
import {noColorMetric} from "../constants/Metrics";
import {defaultProfile} from "../constants/Profiles";
import {DEFAULT_COLOR_THEME} from "../constants/SceneColorThemes";
import {NO_TEST_CLASSES_VARIANT} from "../constants/TestClassesVariants";
import BuildingColorTheme from "./BuildingColorTheme";
import Layout from "./Layout";
import Metric from "./Metric";
import Profile from "./Profile";
import {SceneColorTheme} from "./SceneColorTheme";
import {TestClassesVariant} from "./TestClassesVariant";

export default class VisualizationOptions {

    public static createDefault(): VisualizationOptions {
        return new VisualizationOptions(defaultProfile.clone(), evostreet, noColorMetric,
            DEFAULT_BUILDING_COLOR_THEME, DEFAULT_COLOR_THEME, NO_TEST_CLASSES_VARIANT);
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
    @observable
    public testClassesVariant: TestClassesVariant;

    constructor(profile: Profile, layout: Layout, metricColor: Metric,
                buildingColorTheme: BuildingColorTheme, colorTheme: SceneColorTheme,
                testClassesVariant: TestClassesVariant) {
        this.profile = profile;
        this.layout = layout;
        this.metricColor = metricColor;
        this.buildingColorTheme = buildingColorTheme;
        this.colorTheme = colorTheme;
        this.testClassesVariant = testClassesVariant;
    }

    public equalStructure(candidate: VisualizationOptions | null): boolean {
        if (candidate) {
            return this.layout === candidate.layout
                && this.profile.footprintMetric === candidate.profile.footprintMetric
                && this.profile.heightMetric === candidate.profile.heightMetric
                && this.profile.scale === candidate.profile.scale
                && this.testClassesVariant === candidate.testClassesVariant;
        } else {
            return false;
        }
    }
}
