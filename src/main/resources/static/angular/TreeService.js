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
    return {
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
        }
    }
}]);