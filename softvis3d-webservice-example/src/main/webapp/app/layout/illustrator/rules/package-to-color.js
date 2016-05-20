module.exports = function (options = {}) {
    var defaults = {
        'attribute': 'color'
    };

    for (var i in defaults) {
        if (i in options) {
            continue;
        }

        options[i] = defaults[i];
    }


    function hashCode(str) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
           hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    }

    return function (node) {
        // Applies only to classes
        if (node.children.length || !node.parent) {
            return;
        }

        var parentName = String(node.parent);
        var uuid = hashCode(parentName);

        var newAttributes = {};
        newAttributes[options.attribute] = uuid;
        return newAttributes;
    };
};
