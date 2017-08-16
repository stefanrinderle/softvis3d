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
import {
    SonarQubeApiComponent, SonarQubeQualifier, SQ_QUALIFIER_DIRECTORY, SQ_QUALIFIER_FILE,
    SQ_QUALIFIER_SUB_PROJECT
} from "./SonarQubeMeasureResponse";
import SonarQubeTransformer from "../SonarQubeTransformer";
import SonarQubeMeasuresApiService from "./SonarQubeMeasuresApiService";
import {AppStatusStore} from "../../../stores/AppStatusStore";
import SonarQubeMeasuresService from "./SonarQubeMeasuresService";

export default class SonarQubeMeasuresTreeService {

    private measureApiService: SonarQubeMeasuresApiService;
    private appStatusStore: AppStatusStore;

    constructor(appStatusStore: AppStatusStore, measureApiService: SonarQubeMeasuresApiService) {
        this.appStatusStore = appStatusStore;
        this.measureApiService = measureApiService;
    }

    public loadTree(parent: TreeElement, metricKeys: string): Promise<void> {
        this.appStatusStore.loadStatusUpdateIncrementMax(SonarQubeMeasuresService.LOAD_MEASURES.key);

        return new Promise<void>((resolve, reject) => {
            /**
             * Load the direct children of the given component. In SQ terms this means only directories or sub-projects
             * will be loaded.
             */
            let qualifiers: SonarQubeQualifier[] = [SQ_QUALIFIER_DIRECTORY, SQ_QUALIFIER_SUB_PROJECT];
            this.measureApiService.loadMeasures(parent.key, metricKeys, "children", qualifiers).then((result) => {
                if (result.components.length === 0) {
                    this.resolveLoadTree(resolve);
                }

                let filteredComponents = this.filterComponents(result.components);

                if (this.isSubProjectResponse(filteredComponents)) {
                    this.processNodeLevel(filteredComponents, parent, metricKeys).then(() => {
                        this.resolveLoadTree(resolve);
                    }).catch((error) => {
                        reject(error);
                    });
                } else {
                    this.processLeafLevel(filteredComponents, parent, metricKeys).then(() => {
                        this.resolveLoadTree(resolve);
                    }).catch((error) => {
                        reject(error);
                    });
                }
            }).catch((error) => {
                reject(error);
            });
        });
    }

    public optimizeDirectoryStructure(element: TreeElement) {
        if (element.isFile || element.children.length === 0) {
            return;
        }

        let checkAgain: boolean = false;
        for (let index = 0; index < element.children.length; index++) {
            checkAgain = this.processChild(element.children, index);
        }

        if (checkAgain) {
            this.optimizeDirectoryStructure(element);
        }
    }

    private filterComponents(components: SonarQubeApiComponent[]): SonarQubeApiComponent[] {
        let result: SonarQubeApiComponent[] = [];

        for (const component of components) {
            // ignore the folder with just "/" because this is not needed.
            if (component.path !== "/") {
                result.push(component);
            }
        }

        return result;
    }

    private isSubProjectResponse(components: SonarQubeApiComponent[]): boolean {
        for (const component of components) {
            if (component.qualifier === SQ_QUALIFIER_SUB_PROJECT) {
                return true;
            }
        }

        return false;
    }

    private processChild(children: TreeElement[], index: number): boolean {
        let child = children[index];

        if (child.isFile) {
            return false;
        }

        this.optimizeDirectoryStructure(child);

        if (child.children.length === 1 && !child.children[0].isFile) {
            // The element child only contains a single folder.
            child.children[0].parent = child.parent;

            if (child.parent) {
                child.parent.replaceChildByKey(child.key, child.children[0]);
            }
        }

        if (child.children.length === 0) {
            children.splice(index, 1);
            return true;
        }

        return false;
    }

    private resolveLoadTree(resolve: Function) {
        this.appStatusStore.loadStatusUpdateIncrementCurrent(SonarQubeMeasuresService.LOAD_MEASURES.key);
        resolve();
    }

    private processLeafLevel(components: SonarQubeApiComponent[], parent: TreeElement,
                             metricKeys: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            /**
             * Add each directory to the tree based on the current parent.
             */
            for (const component of components) {
                SonarQubeTransformer.add(parent, SonarQubeTransformer.createTreeElement(component));
            }
            /**
             * The files are still missing, so request them for the same key as the directories have been
             * requested.
             */
            this.measureApiService.loadMeasures(
                parent.key, metricKeys, "all", [SQ_QUALIFIER_FILE]).then((filesResult) => {
                for (const file of filesResult.components) {
                    SonarQubeTransformer.add(parent, SonarQubeTransformer.createTreeElement(file), true);
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

                parent.children.push(node);
                node.parent = parent;

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