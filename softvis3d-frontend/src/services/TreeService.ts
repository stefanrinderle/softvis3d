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

import {TreeElement} from "../classes/TreeElement";
export class TreeService {

    public static searchTreeNode(tree: TreeElement, id: string): TreeElement | null {
        if (tree) {
            return this.searchIdInElement(id, tree);
        } else {
            return null;
        }
    }

    public static getAllSceneElementsRecursive(tree: TreeElement, id: string): string[] {
        let node = this.searchTreeNode(tree, id);
        if (node === null) {
            return [];
        } else {
            return this.privateGetAllSceneElementsRecursive(node);
        }
    }

    public static getAllFiles(node: TreeElement): TreeElement[] {
        let results: TreeElement[] = [];

        if (node.isFile) {
            results.push(node);
        }

        // children nodes
        for (const child of node.children) {
            let result = this.getAllFiles(child);
            results = results.concat(result);
        }

        return results;
    }

    private static searchIdInElement(id: string, element: TreeElement): TreeElement | null {
        if (element.id === id) {
            return element;
        }

        for (const child of element.children) {
            let result = this.searchIdInElement(id, child);
            if (result) {
                return result;
            }
        }

        return null;
    }

    private static privateGetAllSceneElementsRecursive(node: TreeElement): string[] {
        let showIds: string[] = [];
        showIds.push(node.id);

        // children nodes
        for (const child of node.children) {
            let result = this.privateGetAllSceneElementsRecursive(child);
            showIds = showIds.concat(result);
        }

        return showIds;
    }

}