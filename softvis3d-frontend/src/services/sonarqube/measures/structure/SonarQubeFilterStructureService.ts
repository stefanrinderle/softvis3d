///
import {TestClassesVariant} from "../../../../classes/TestClassesVariant";
/// softvis3d-frontend
/// Copyright (C) 2016 Stefan Rinderle and Yvo Niedrich
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
import {TreeElement} from "../../../../classes/TreeElement";
import {NO_TEST_CLASSES_VARIANT, ONLY_TEST_CLASSES_VARIANT} from "../../../../constants/TestClassesVariants";
import {SQ_QUALIFIER_FILE, SQ_QUALIFIER_UNIT_TEST_FILE} from "../api/SonarQubeMeasureResponse";

export default class SonarQubeFilterStructureService {

    public optimize(element: TreeElement, testClassesVariant: TestClassesVariant) {
        if (element.isFile() || element.children.length === 0) {
            return;
        }

        for (let index = element.children.length; index--;) {
            this.processChild(element.children, index, testClassesVariant);
        }
    }

    private processChild(children: TreeElement[], index: number, testClassesVariant: TestClassesVariant) {
        const child = children[index];

        const shouldRemoveTestFile = child.qualifier === SQ_QUALIFIER_UNIT_TEST_FILE && testClassesVariant === NO_TEST_CLASSES_VARIANT;
        const shouldRemoveSourceFile = child.qualifier === SQ_QUALIFIER_FILE && testClassesVariant === ONLY_TEST_CLASSES_VARIANT;
        if (child.isFile() && (shouldRemoveTestFile || shouldRemoveSourceFile)) {
            children.splice(index, 1);
        }

        if (!child.isFile()) {
            this.optimize(child, testClassesVariant);
        }
    }

}
