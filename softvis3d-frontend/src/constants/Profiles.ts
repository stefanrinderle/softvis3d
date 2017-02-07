import * as Metric from "./Metrics";
import LayoutProcessor from "../legacy/LayoutProcessor";
import Profile, { ProfileBuilder } from "../classes/Profile";

const defaultProfile: Profile = new ProfileBuilder("default", "Default")
    .withConfiguration(Metric.complexityMetric, Metric.linesOfCodeMetric, LayoutProcessor.SCALING_METHODS[0])
    .withDescription("Default risk analysis profile. Complexity as building width and lines of code as building" +
        " height provide a very good overview of the structure of your project. It should be easy to identify the " +
        "classes or packages with the highest risks. Change the building color to take a closer look at the " +
        "interesting parts.")
    .build();

const leakPeriod: Profile = new ProfileBuilder("leakPeriod", "Leak period")
    .withConfiguration(Metric.complexityMetric, Metric.newLinesOfCodeMetric, LayoutProcessor.SCALING_METHODS[0])
    .withDescription("Check the quality of new code in the current leak period. It should be easy to identify the " +
        "changing parts of the system (high buildings) and to identify the parts with the most risk. Take a closer look " +
        "at the changing parts during the next release tests.")
    .build();

const duplicatedLinesOfCode: Profile = new ProfileBuilder("duplicatedLinesOfCode", "Duplicated lines")
    .withConfiguration(Metric.complexityMetric, Metric.duplicatedLinesOfCodeMetric, LayoutProcessor.SCALING_METHODS[0])
    .withDescription("Buildings only gain height if duplicated code is found within the class or file. Search for " +
        "hot spots of high buildings. High and massive buildings could contain complex duplicated code which is " +
        "a high risk especially if a lot of changes take place.")
    .build();

const custom: Profile = new ProfileBuilder("custom", "Customize")
    .withConfiguration(Metric.noMetric, Metric.noMetric, LayoutProcessor.SCALING_METHODS[0])
    .withDescription("Select any metric using the 'Advanced options' at the bottom of this dialog.")
    .build();

export {
    defaultProfile,
    leakPeriod,
    duplicatedLinesOfCode,
    custom
}

export class Profiles {

    public static availableProfiles: Profile[] = [
        defaultProfile,
        leakPeriod,
        duplicatedLinesOfCode,
        custom
    ];

    public static getAvailableProfileById(id: string): Profile {
        for (let searchProfile of this.availableProfiles) {
            if (searchProfile.id === id) {
                return searchProfile;
            }
        }
        return custom;
    }

}