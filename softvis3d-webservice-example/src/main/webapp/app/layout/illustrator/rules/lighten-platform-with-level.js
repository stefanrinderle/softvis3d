module.exports = function (options = {}) {
    var defaults = {
        'default': 0x000000,
        'lighten': 0x101010,
        'maxsteps': 15,
        'attribute': 'color'
    };

    for (var i in defaults) {
        if (i in options) {
            continue;
        }

        options[i] = defaults[i];
    }

    return function (node) {
        // Does not apply to classes
        if (!node.children.length) {
            return;
        }

        var level = 0;
        while(node = node.parent) {
            level++;
        }

        level = Math.min(level, options.maxsteps);

        var newAttributes = {};
        newAttributes[options.attribute] = options.default + (level * options.lighten);
        return newAttributes;
    };
};
