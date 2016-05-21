module.exports = function (options = {}) {
    var defaults = {
        'attribute': 'versions.first'
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

        var versions = model.versions,
            result = null;

        for(var v of versions) {
            if(model.exists(node, v)) {
                result = v;
                break;
            }
        }

        if (!result) {
            result = 'xxxxxxxxxx';
        }
        
        var newAttributes = {};
        newAttributes[options.attribute] = result;
        return newAttributes;
    };
};
