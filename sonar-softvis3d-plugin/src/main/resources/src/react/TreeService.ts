/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2016 Stefan Rinderle
 * stefan@rinderle.info
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
 */

import {TreeElement} from "./TreeElement";

export class TreeService {

    private static _instance: TreeService;

    private treeServiceTree: TreeElement;

    public static get Instance(): TreeService {
        return this._instance || (this._instance = new this());
    }

    public setTree(tree: TreeElement) {
        this.treeServiceTree = tree;
    };

    public searchTreeNode(id: string): TreeElement {
        if (this.treeServiceTree !== null) {
            return this.searchIdInElement(this.treeServiceTree, id);
        } else {
            console.warn("search for id " + id + " without initialized the tree.");
        }
    };

    public getAllSceneElementsRecursive(id: string): string[] {
        let node = this.searchTreeNode(id);
        return this.privateGetAllSceneElementsRecursive(node);
    };

    private searchIdInElement(element: TreeElement, id: string): TreeElement {
        if (element.id === id) {
            return element;
        } else if (element.children !== null) {
            let result: TreeElement = null;
            for (let i = 0; result === null && i < element.children.length; i++) {
                result = this.searchIdInElement(element.children[i], id);
            }
            return result;
        }
        return null;
    };

    private privateGetAllSceneElementsRecursive(node: TreeElement): string[] {
        let showIds: string[] = [];
        showIds.push(node.id);

        // children nodes
        for (let i = 0; i < node.children.length; i++) {
            let result = this.privateGetAllSceneElementsRecursive(node.children[i]);
            showIds = showIds.concat(result);
        }

        return showIds;
    };
}