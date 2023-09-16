///
/// softvis3d-frontend
/// Copyright (C) 2020 Stefan Rinderle and Yvo Niedrich
/// stefan@rinderle.info / yvo.niedrich@gmail.com
///
/// This program is free software; you can redistribute it and/or
/// modify it under the terms of the GNU Lesser General Public
/// License as published by the Free Software Foundation; either
/// version 3 of the License, or (at your option) any later version.
///
/// This program is distributed in the hope that it will be useful,
/// but WITHOUT ANY WARRANTY; without even the implied warranty of
/// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
/// Lesser General Public License for more details.
///
/// You should have received a copy of the GNU Lesser General Public
/// License along with this program; if not, write to the Free Software
/// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
///

/**
 * Outside this package should be no sonarqube specific stuff. This class is needed to abstract our logic
 * from SQ.
 */
import { TreeElement } from "../../../../classes/TreeElement";
import { SonarQubeApiComponent } from "./SonarQubeMeasureResponse";

export default class SonarQubeTransformerService {
    public createTreeElement(component: SonarQubeApiComponent, parent?: TreeElement): TreeElement {
        const measureList: MeasureList = {};

        for (const localMeasure of component.measures) {
            if (localMeasure.value) {
                measureList[localMeasure.metric] = +localMeasure.value;
            } else {
                if (localMeasure.period) {
                    measureList[localMeasure.metric] = +localMeasure.period.value;
                }
            }
        }

        return new TreeElement(
            component.key,
            measureList,
            component.name,
            component.path,
            component.qualifier,
            parent
        );
    }

    /**
     * Will be called with the path of the components sorted.
     */
    public add(parent: TreeElement, element: TreeElement, examineInReversedOrder = false) {
        let children: TreeElement[] = parent.children;
        if (examineInReversedOrder) {
            children = [...parent.children].reverse();
        }

        for (const child of children) {
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
