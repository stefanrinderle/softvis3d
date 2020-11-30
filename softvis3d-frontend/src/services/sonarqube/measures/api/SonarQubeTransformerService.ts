/**
 * Outside this package should be no sonarqube specific stuff. This class is needed to abstract our logic
 * from SQ.
 */
import {TreeElement} from "../../../../classes/TreeElement";
import {SonarQubeApiComponent} from "./SonarQubeMeasureResponse";

export default class SonarQubeTransformerService {

    public createTreeElement(component: SonarQubeApiComponent, parent?: TreeElement): TreeElement {
        const measureList: MeasureList = {};

        for (let localMeasure of component.measures) {
            if (localMeasure.value) {
                measureList[localMeasure.metric] = +localMeasure.value;
            } else {
                if (localMeasure.periods.length > 0) {
                    measureList[localMeasure.metric] = +localMeasure.periods[0].value;
                }
            }
        }

        return new TreeElement(component.id, component.key, measureList, component.name, component.path,
            component.qualifier, parent);
    }

    /**
     * Will be called with the path of the components sorted.
     */
    public add(parent: TreeElement, element: TreeElement, examineInReversedOrder: boolean = false) {
        let children: TreeElement[] = parent.children;
        if (examineInReversedOrder) {
            children = [...parent.children].reverse();
        }

        for (let child of children) {
            const indexOf = element.path.indexOf(child.path + "/");

            if (indexOf === 0) {
                this.add(child, element, examineInReversedOrder);
                return;
            }
        }

        if (!element.isFile()) {
            const indexOf = element.path.indexOf(parent.path + "/");
            if (indexOf === 0) {
                element.name = element.path.substr(parent.path.length + 1, element.path.length);
            }
        }
        parent.children.push(element);

        element.parent = parent;
    }

}