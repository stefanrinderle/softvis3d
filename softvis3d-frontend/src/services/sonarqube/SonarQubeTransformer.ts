import {TreeElement} from "../../classes/TreeElement";
import {SonarQubeApiComponent} from "./measures/SonarQubeMeasureResponse";

/**
 * Outside this package should be no sonarqube specific stuff. This class is needed to abstract our logic
 * from SQ.
 */
export default class SonarQubeTransformer {

    public static createTreeElement(component: SonarQubeApiComponent, parent?: TreeElement): TreeElement {
        let measureList: MeasureList = {};

        for (let localMeasure of component.measures) {
            if (localMeasure.value) {
                measureList[localMeasure.metric] = +localMeasure.value;
            } else {
                if (localMeasure.periods.length > 0) {
                    measureList[localMeasure.metric] = +localMeasure.periods[0].value;
                }
            }
        }

        let isFile: boolean = component.qualifier === "FIL" || component.qualifier === "UTS";

        return new TreeElement(component.id, component.key, measureList, component.name, component.path,
            isFile, parent);
    }

}