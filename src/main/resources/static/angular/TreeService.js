/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2014 Stefan Rinderle
 * stefan@rinderle.info
 *
 * SoftVis3D Sonar plugin can not be copied and/or distributed without the express
 * permission of Stefan Rinderle.
 */
softVis3dAngular.factory('treeService', [ function(){
    var treeServiceTree = null;
    var service = {
        setTree : function (tree) {
            treeServiceTree = tree;
        },

        searchTree : function (id) {
            if (treeServiceTree != null) {
                return this.searchIdInElement(treeServiceTree, id);
            } else {
                console.warn("search for id " + id + " without initialized the tree.")
            }
        },

        searchIdInElement : function (element, id) {
            if (element.id == id) {
                return element;
            } else if (element.children != null) {
                var result = null;
                for (var i = 0; result == null && i < element.children.length; i++) {
                    result = this.searchIdInElement(element.children[i], id);
                }
                return result;
            }
            return null;
        },

        getDependencyForId : function (id) {
            var dependencies = treeServiceTree.dependencies;
            for (var i = 0; i < dependencies.length; i++) {
                if (id === dependencies[i].id) {
                    return dependencies[i].sourceName + " -> "
                        + dependencies[i].destinationName;
                }
            }
        },

        showAllSceneElements: function () {
            service.privateShowAllSceneElementsRecursive(treeServiceTree);
        },

        privateShowAllSceneElementsRecursive: function (node) {
            node.isHidden = false;

            // children nodes
            for (var i = 0; i < node.children.length; i++) {
                service.privateShowAllSceneElementsRecursive(node.children[i]);
            }

            // edges
            for (var j = 0; j < node.edges.length; j++) {
                node.edges[j].isHidden = false;
            }
        },

        getPlatformElementIds : function (parentId) {
            var parentNode = service.searchTree(parentId);

            var result = [];

            // children nodes
            for (var i = 0; i < parentNode.children.length; i++) {
                result.push(parentNode.children[i].id);

                // edges
                for (var j = 0; j < parentNode.children[i].edges.length; j++) {
                    result.push(parentNode.children[i].edges[j].id);
                }
            }

            return result;
        }
    };

    return service;
}]);