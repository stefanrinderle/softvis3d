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

import {
    SQ_QUALIFIER_FILE,
    SQ_QUALIFIER_UNIT_TEST_FILE,
} from "../services/sonarqube/measures/api/SonarQubeMeasureResponse";
import Metric from "./Metric";

export class TreeElement {
    private static sortByNameAndType(a: TreeElement, b: TreeElement) {
        if (a.isFile() === b.isFile()) {
            return a.name.localeCompare(b.name);
        }

        return a.isFile() ? 1 : -1;
    }

    public readonly key: string;
    public measures: MeasureList;

    public name: string;
    public readonly path: string;

    public parent?: TreeElement;
    public readonly children: TreeElement[];

    public readonly qualifier: string;

    public constructor(
        key: string,
        measures: MeasureList,
        name: string,
        path: string,
        qualifier: string,
        parent?: TreeElement
    ) {
        this.key = key;
        this.measures = measures;
        this.name = name;
        this.path = path;
        this.qualifier = qualifier;
        this.parent = parent;
        this.children = [];
    }

    public isFile(): boolean {
        return (
            this.qualifier === SQ_QUALIFIER_FILE || this.qualifier === SQ_QUALIFIER_UNIT_TEST_FILE
        );
    }

    public getSortedChildren(): TreeElement[] {
        return this.children.sort(TreeElement.sortByNameAndType.bind(this));
    }

    public replaceChildByKey(key: string, replaceChild: TreeElement) {
        for (let index = 0; index < this.children.length; index++) {
            if (key === this.children[index].key) {
                replaceChild.name = `${this.children[index].name}/${replaceChild.name}`;
                this.children[index] = replaceChild;
                break;
            }
        }
    }

    public getMeasureValue(metric: Metric): number | null {
        if (this.measures && metric.id in this.measures) {
            return this.measures[metric.id];
        } else {
            return null;
        }
    }

    public clone(): TreeElement {
        const treeElement = new TreeElement(
            this.key,
            this.measures,
            this.name,
            this.path,
            this.qualifier,
            this.parent
        );

        for (const child of this.children) {
            treeElement.children.push(child.clone());
        }

        return treeElement;
    }
}
