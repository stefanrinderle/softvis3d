///
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
import {TreeElement} from "../../../classes/TreeElement";
import {SonarQubeApiComponent} from "./SonarQubeMeasureResponse";
import SonarQubeTransformer from "../SonarQubeTransformer";
import SonarQubeMeasuresApiService from "./SonarQubeMeasuresApiService";

export default class SonarQubeMeasuresTreeService {

    private measureApiService: SonarQubeMeasuresApiService;

    constructor(measureApiService: SonarQubeMeasuresApiService) {
        this.measureApiService = measureApiService;
    }

    public loadTree(parent: TreeElement, metricKeys: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            /**
             * Load the direct children of the given component. In SQ terms this means only directories or sub-projects
             * will be loaded.
             */
            this.measureApiService.loadMeasures(parent.key, metricKeys, "children", ["DIR", "BRC"]).then((result) => {
                if (result.components.length === 0) {
                    resolve();
                }
                /**
                 * The result contains either only dirs or only sub-projects.
                 */
                if (result.components[0].qualifier === "DIR") {
                    this.processLeafLevel(result.components, parent, metricKeys).then(() => {
                        resolve();
                    }).catch((error) => {
                        reject(error);
                    });
                } else if (result.components[0].qualifier === "BRC") {
                    this.processNodeLevel(result.components, parent, metricKeys).then(() => {
                        resolve();
                    }).catch((error) => {
                        reject(error);
                    });
                }
            }).catch((error) => {
                reject(error);
            });
        });
    }

    public removeEmptyDirectories(element: TreeElement) {
        if (element.children.length === 0) {
            return;
        } else {
            let checkAgain: boolean = false;
            for (let index = 0; index < element.children.length; index++) {
                let child = element.children[index];
                if (!child.isFile) {
                    if (child.children.length === 0) {
                        element.children.splice(index, 1);
                        checkAgain = true;
                    } else {
                        this.removeEmptyDirectories(child);

                        if (child.children.length === 0) {
                            element.children.splice(index, 1);
                            checkAgain = true;
                        }
                    }
                }
            }
            if (checkAgain) {
                this.removeEmptyDirectories(element);
            }
        }
    }

    private processLeafLevel(components: SonarQubeApiComponent[], parent: TreeElement,
                            metricKeys: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            /**
             * Add each directory to the tree based on the current parent.
             */
            for (const component of components) {
                // ignore the folder with just "/" because this is not needed.
                if (component.path !== "/") {
                    parent.addAsChild(SonarQubeTransformer.createTreeElement(component));
                }
            }
            /**
             * The files are still missing, so request them for the same key as the directories have been
             * requested.
             */
            this.measureApiService.loadMeasures(parent.key, metricKeys, "all", ["FIL"]).then((filesResult) => {
                for (const file of filesResult.components) {
                    parent.addAsChild(SonarQubeTransformer.createTreeElement(file), true);
                }
                resolve();
            }).catch((error) => {
                reject(error);
            });
        });
    }

    private processNodeLevel(components: SonarQubeApiComponent[], parent: TreeElement,
                            metricKeys: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            /**
             * For sub-projects, we do the following:
             * 1. Create a TreeElement
             * 2. Add the sub-project as child to the current node.
             * 3. Load again with the sub-project as parent.
             */
            let requests: Array<Promise<void>> = [];
            for (const subProject of components) {
                let node: TreeElement = SonarQubeTransformer.createTreeElement(subProject);

                if (parent) {
                    parent.children.push(node);
                }

                requests.push(this.loadTree(node, metricKeys));
            }
            Promise.all(requests).then(() => {
                resolve();
            }).catch((error) => {
                reject(error);
            });
        });
    }

}