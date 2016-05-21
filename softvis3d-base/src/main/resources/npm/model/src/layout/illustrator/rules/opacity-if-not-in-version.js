module.exports = function (options = {}) {
    var defaults = {
        'attribute': 'opacity',
        'opacity': 0.3
    };

    for (var key in defaults) {
        if (key in options) {
            continue;
        }

        options[key] = defaults[key];
    }

    return function (node, version, model) {
        // Applies only to classes
        if (node.children.length) {
            return;
        }

        if(!model.exists(node, version)) {
            var newAttributes = {};
            newAttributes[options.attribute] = options.opacity;
            return newAttributes;
        }
    };
};
