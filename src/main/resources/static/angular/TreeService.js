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

        privateGetAllSceneElementsRecursive: function (node) {
            var showIds = [];
            showIds.push(node.id);

            // children nodes
            for (var i = 0; i < node.children.length; i++) {
                var result = service.privateGetAllSceneElementsRecursive(node.children[i]);
                showIds = showIds.concat(result);
            }

            // edges
            for (var j = 0; j < node.edges.length; j++) {
                showIds.push(node.edges[j].id);
            }

            return showIds;
        },

        getAllSceneElementsRecursive : function(id) {
            var node = service.searchTree(id);
            var showIds = service.privateGetAllSceneElementsRecursive(node);

            return showIds;
        }

    };

    return service;
}]);