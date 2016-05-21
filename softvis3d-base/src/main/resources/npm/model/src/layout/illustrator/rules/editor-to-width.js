module.exports = function (options = {}) {
    var defaults = {
        'metric': 'editors',
        'min': 10,
        'max': 65,
        'logexp' : 2.75,
        'logsbase' : 2,
        'factor': 1,
        'fallback': true
    };

    for (var key in defaults) {
        if (key in options) {
            continue;
        }

        options[key] = defaults[key];
    }

    function getAttributes(node, version, model) {
        if (!options.fallback || model.exists(node, version)) {
            return model.attributes(node, version);
        }

        for (var v of model.versions) {
            if (model.exists(node, v)) {
                return model.attributes(node, v);
            }
        }

        return {};
    }

    return function (node, version, model) {
        // Applies only to classes
        if (node.children.length) {
            return;
        }

        var attributes = getAttributes(node, version, model);
        if (!(options.metric in attributes)) {
            return;
        }

        var editors = attributes[options.metric];
        editors = Math.pow(Math.log(editors + 1) / Math.log(options.logsbase), options.logexp) + defaults.min;
        editors *= options.factor;
        
        var value = Math.min(Math.max(editors, options.min), options.max);

        var newAttributes = {};
        newAttributes['dimensions.length'] = value;
        newAttributes['dimensions.width']  = value;
        return newAttributes;
    };
};
