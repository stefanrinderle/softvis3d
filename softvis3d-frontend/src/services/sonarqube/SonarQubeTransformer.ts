import {TreeElement} from "../../classes/TreeElement";
import {
    SonarQubeApiComponent, SQ_QUALIFIER_FILE,
    SQ_QUALIFIER_UNIT_TEST_FILE
} from "./measures/SonarQubeMeasureResponse";

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

        let isFile: boolean =
            component.qualifier === SQ_QUALIFIER_FILE || component.qualifier === SQ_QUALIFIER_UNIT_TEST_FILE;

        return new TreeElement(component.id, component.key, measureList, component.name, component.path,
            isFile, parent);
    }

    /**
     * Will be called with the path of the components sorted.
     */
    public static add(parent: TreeElement, element: TreeElement, examineInReversedOrder: boolean = false) {
        let children: TreeElement[] = parent.children;
        if (examineInReversedOrder) {
            children = [...parent.children].reverse();
        }

        for (let child of children) {
            let indexOf = element.path.indexOf(child.path + "/");

            if (indexOf === 0) {
                SonarQubeTransformer.add(child, element, examineInReversedOrder);
                return;
            }
        }

        if (!element.isFile) {
            let indexOf = element.path.indexOf(parent.path + "/");
            if (indexOf === 0) {
                element.name = element.path.substr(parent.path.length + 1, element.path.length);
            }
        }
        parent.children.push(element);

        element.parent = parent;
    }

}