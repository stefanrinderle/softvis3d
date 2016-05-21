module.exports = {
    'models': {
        'base' : require("./model/base.js"),
        'dummy' : require("./model/dummy.js")
    },

    'components': {
        'dependency': require("./model/components/dependency.js"),
        'version':    require("./model/components/version.js"),
        'node':       require("./model/components/treenode.js")
    },

    'illustrators': {
        'base':      require("./illustrator/base.js"),
        'evostreet': require("./illustrator/evostreet.js"),
        'districts': require("./illustrator/district.js")
    },

    'containers': {
        'base':     require("./illustrator/container/base.js"),
        'row':      require("./illustrator/container/row.js"),
        'lightmap': require("./illustrator/container/lightmap.js"),
        'grid':     require("./illustrator/container/grid.js")
    },

    // TODO: Brauche ich wirklich Shapes???
    'shapes': {
        'base':     require("./illustrator/shapes/base.js"),
        'house':    require("./illustrator/shapes/house.js"),
        'street':   require("./illustrator/shapes/street.js"),
        'platform': require("./illustrator/shapes/platform.js")
    },

    // TODO!
    'rules': {
        // ....
    }
}