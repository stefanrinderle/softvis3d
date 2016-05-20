var BaseIllustrator = require("./base.js");
var Point           = require("./components/point.js");
var Illustration    = require('./components/illustration.js');
var ShapeHouse      = require("./shapes/house.js");
var ShapePlatform   = require("./shapes/platform.js");
var ShapeContainer  = require("./container/districtcontainer.js");

/**
 * Create an evostreet city
 *
 * @implements BaseIllustrator
 */
class District extends BaseIllustrator {
    constructor(model, options = {}) {
        super(model, options);

        this._rules = [];
        this._model = model;
        this._options = {
            'house.length': 16,
            'house.width': 16,
            'house.height': 16,
            'house.margin': 3,
            'house.color': 0x1A212E,

            'platform.color': 0x000000,

            'district.container': ShapeContainer,
            'district.options': {},
        }

        for (var i in options) {
            this._options[i] = options[i];
        }
    };

    addRule(rule) {
        this._rules.push(rule);
    };

    draw(version) {
        var spatialModel = this._createSpatialModel(this._model.tree, version);

        var origin = new Point(0, 0, 0);
        var rotation = 0;
        spatialModel.draw(origin, rotation);

        var illustration = new Illustration(version);
        for (var shape of spatialModel.getSpatialInformation()) {
            illustration.addShape(shape);
        }
        
        return illustration;
    }

    _createSpatialModel(tree, version, depth = 0) {
        if (!tree.children.length) {
            return this._createHouse(tree, version);
        }



        var container = new this._options['district.container'](tree, this._options['district.options']);
        container.add(this._createPlatform(tree, version));

        for (var child of tree.children) {
            container.add(this._createSpatialModel(child, version, depth + 1));
        }

        return container;
    };

    _createHouse(node, version) {
        var defaultLayout = {
            'dimensions.length': this._options['house.length'],
            'dimensions.width': this._options['house.width'],
            'dimensions.height': this._options['house.height'],
            'margin': this._options['house.margin'],
            'color': this._options['house.color']
        };

        var house = new ShapeHouse(node);
        house.updateAttributes(defaultLayout);
        this._applyRules(node, version, house);
        return house;
    };

    _createPlatform(node, version) {
        var defaultLayout = {
            'color': this._options['platform.color']
        };

        var platform = new ShapePlatform(this.key + '_p');
        platform.updateAttributes(defaultLayout);
        this._applyRules(node, version, platform);
        return platform;
    };

    _applyRules(node, version, shape) {
        var attributes = {};
        for (var rule of this._rules) {
            Object.assign(attributes, rule(node, version, this._model))
        }

        shape.updateAttributes(attributes);
    }
}

module.exports = District;
