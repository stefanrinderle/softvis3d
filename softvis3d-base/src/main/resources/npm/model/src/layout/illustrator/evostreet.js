var BaseIllustrator = require("./base.js");
var Point           = require("./components/point.js");
var Illustration    = require('./components/illustration.js');
var ShapeHouse      = require("./shapes/house.js");
var ShapeStreet     = require("./shapes/street.js");
var ShapeContainer  = require("./container/streetcontainer.js");

/**
 * Create an evostreet city
 *
 * @implements BaseIllustrator
 */
class Evostreet extends BaseIllustrator {
    constructor(model, options = {}) {
        super(model, options);

        this._rules = [];
        this._model = model;
        this._options = {
            'highway.length': 36,
            'highway.color': 0x156289,

            'street.length': 18,
            'street.color': 0x156289,

            'house.length': 16,
            'house.width': 16,
            'house.height': 16,
            'house.margin': 3,
            'house.color': 0x1A212E,

            'evostreet.container': ShapeContainer,
            'evostreet.options': {},
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

    _createSpatialModel(tree, version) {
        if (!tree.children.length) {
            return this._createHouse(tree, version);
        }

        var container = new this._options['evostreet.container'](tree, this._options['evostreet.options']);

        for (var child of tree.children) {
            container.add(this._createSpatialModel(child, version));
        }

        if (tree.parent === null) {
            container.add(this._createHighway(tree, version));
        } else {
            container.add(this._createStreet(tree, version));
        }

        return container;
    };

    _createHighway(node, version) {
        var defaultLayout = {
            'dimensions.length': this._options['highway.length'],
            'dimensions.height': 1,
            'color': this._options['highway.color']
        };

        var highway = new ShapeStreet(node);
        highway.updateAttributes(defaultLayout);
        this._applyRules(node, version, highway);
        return highway;
    };

    _createStreet(node, version) {
        var defaultLayout = {
            'dimensions.length': this._options['street.length'],
            'dimensions.height': 1,
            'color': this._options['street.color']
        };

        var street = new ShapeStreet(node);
        street.updateAttributes(defaultLayout);
        this._applyRules(node, version, street);
        return street;
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

    _applyRules(node, version, shape) {
        var attributes = {};
        for (var rule of this._rules) {
            Object.assign(attributes, rule(node, version, this._model))
        }

        shape.updateAttributes(attributes);
    }
}

module.exports = Evostreet;
