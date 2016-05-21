var BaseContainer     = require("./base.js");
var LightmapContainer = require("./lightmap.js");
var ShapeHouse        = require("../shapes/house.js");
var ShapePlatform     = require("../shapes/platform.js");
var Point             = require("../components/point.js");

/**
 * Create an evostreet city
 * 
 * @implements BaseContainer
 * @implements BaseShape
 */
class DistrictContainer extends BaseContainer {
    constructor(key, options = {}) {
        super(key);
        this._options = {
            'spacer.margin': 10,
            'spacer.padding': 5,

            'platform.height': 10,

            'district.container': LightmapContainer,
            'district.options': false,

            'houses.container': LightmapContainer,
            'houses.options': {}
        };

        for (var i in options) {
            this._options[i] = options[i];
        }

        this._container = {
            'houses': new this._options['houses.container'](this.key + '_d', this._options['houses.options']),
            'districts': new this._options['district.container'](this.key + '_d', this._options['district.options']),
            'platform': null
        }
        super.add(this._container.districts);
    };

    _updateDimensions() {
        this.dimensions.length = this._getContainerLength();
        this.dimensions.width  = this._getContainerWidth() + this._options['spacer.conclusive'];
    };

    add(shape) {
        if (shape instanceof BaseContainer) {
            this._container.districts.add(shape);
        } else if (shape instanceof ShapeHouse) {
            this._container.houses.add(shape);
        } else if (shape instanceof ShapePlatform) {
            if (this._container.platform !== null) {
                throw 'StreetContainer can only have one road.'
            }

            this._container.platform = shape;
        } else {
            throw 'Unbekannter Shape-Typ'
        }
        
    };

    _finalize() {
        super._finalize();

        this._container.districts.add(this._container.houses);

        var padding = 2 * this._options['spacer.padding'];
        this.dimensions.length = this._container.districts.displayDimensions.length + padding;
        this.dimensions.width  = this._container.districts.displayDimensions.width + padding;
        this.dimensions.height  = this._container.districts.displayDimensions.height;

        this._createPlatform();

        var margin = 2 * this._options['spacer.margin'];
        this.dimensions.length += margin;
        this.dimensions.width  += margin;
    };

    _createPlatform() {
        if (!this._container.platform) {
            this._container.platform = new ShapePlatform(this.key + '_p');
        }

        this._container.platform.dimensions.length = this.dimensions.length;
        this._container.platform.dimensions.width = this.dimensions.width;
        this._container.platform.dimensions.height = this._options['platform.height'];
        this._container.platform.position.z = -this._options['platform.height'];

        // Lift everything else above the platform
        this.position.z += this._options['platform.height'];

        super.add(this._container.platform);
    }
}

module.exports = DistrictContainer;
