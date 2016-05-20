var BaseContainer = require("./base.js");
var RowContainer  = require("./row.js");
var ShapeHouse    = require("../shapes/house.js");
var ShapeStreet   = require("../shapes/street.js");
var Point         = require("../components/point.js");

/**
 * Create an evostreet city
 * 
 * @implements BaseContainer
 * @implements BaseShape
 */
class StreetContainer extends BaseContainer {
    constructor(key, options = {}) {
        super(key);
        this._options = {
            'spacer.initial': 15,
            'spacer.branches': 10,
            'spacer.terranullius': 20,
            'spacer.conclusive': 0,

            'house.container': RowContainer,
            'house.distribution': 'default',
            'house.segmentation': null,
            'house.segmentorder': null,

            'branch.container': RowContainer,
            'branch.distribution': 'default',
            'branch.segmentation': null,
            'branch.segmentorder': null
        };

        for (var i in options) {
            this._options[i] = options[i];
        }

        this._container = {
            road: null,
            houses: {
                segments: [],
                segmented: {},
                left: {},
                right: {}
            },
            branches: {
                segments: [],
                segmented: {},
                left: {},
                right: {}
            }
        };
    };

    _updateDimensions() {
        this.dimensions.length = this._getContainerLength();
        this.dimensions.width  = this._getContainerWidth() + this._options['spacer.conclusive'];
    };

    add(shape) {
        if (shape instanceof StreetContainer) {
            this._addBranch(shape);
        } else if (shape instanceof ShapeHouse) {
            this._addHouse(shape);
        } else if (shape instanceof ShapeStreet) {
            if (this._container.road !== null) {
                throw 'StreetContainer can only have one road.'
            }
            this._container.road = shape;
        } else {
            throw 'Unknown Shape';
        }
    };

    _addHouse(shape) {
        var segment, segmentIndex;

        if (this._options['house.segmentation']) {
            segment = shape.getAttribute(this._options['house.segmentation']);
        }

        segment = segment !== null ? segment : 'default';
        segmentIndex = String(segment);

        if (this._container.houses.segments.indexOf(segment) < 0) {
            this._container.houses.segments.push(segment);
            this._container.houses.segmented[segmentIndex] = [];
            this._container.houses.left[segmentIndex]  = new this._options['house.container'](this.key + '_' + segmentIndex + '_hl');
            this._container.houses.right[segmentIndex] = new this._options['house.container'](this.key + '_' + segmentIndex + '_hr', true);
            this._container.houses.left[segmentIndex].rotate(-90);
            this._container.houses.right[segmentIndex].rotate(-90);
        }

        this._container.houses.segmented[segmentIndex].push(shape);
    };

    _addBranch(shape) {
        var segment, segmentIndex;

        if (this._options['branch.segmentation']) {
            segment = shape.getAttribute(this._options['branch.segmentation']);
        }

        segment = segment !== null ? segment : 'default';
        segmentIndex = String(segment);

        if (this._container.branches.segments.indexOf(segment) < 0) {
            this._container.branches.segments.push(segment);
            this._container.branches.segmented[segmentIndex] = [];
            this._container.branches.left[segmentIndex]  = new this._options['branch.container'](this.key + '_' + segmentIndex + '_bl');
            this._container.branches.right[segmentIndex] = new this._options['branch.container'](this.key + '_' + segmentIndex + '_br', true);
            this._container.branches.left[segmentIndex].rotate(-90);
            this._container.branches.right[segmentIndex].rotate(-90);
            this._container.branches.left[segmentIndex].separator = this._options['spacer.branches'];
            this._container.branches.right[segmentIndex].separator = this._options['spacer.branches'];
        }

        this._container.branches.segmented[segmentIndex].push(shape);
    };

    _finalize() {
        super._finalize();

        if (this._container.road === null) {
            throw 'StreetContainer requires a primary street'
        }
        var mainRoad = this._container.road;

        this._prepareSegments();
        this._addHousesToStructure();
        this._addBranchesToStructure();
        this._updateDimensions();
        
        var containersBottom = this._options['spacer.initial'] - (this.dimensions.width / 2)
        var halfTheRoadLength = (mainRoad.displayDimensions.length / 2);
        var middleOfTheRoad = (this.dimensions.length / 2) - this._getRightBlockLength() - halfTheRoadLength;

        mainRoad.dimensions.width = this.dimensions.width;
        mainRoad.position.x = middleOfTheRoad;
        mainRoad.position.y = 0;
        super.add(this._container.road);

        // Place Branches, Segment by Segment
        for (var bSeg of this._container.branches.segments) {
            var bKey = String(bSeg),
                leftBranch = this._container.branches.left[bKey],
                rightBranch = this._container.branches.right[bKey];

            if (leftBranch.size) {
                leftBranch.position.x = middleOfTheRoad - halfTheRoadLength - leftBranch.centroid.x;
                leftBranch.position.y = containersBottom + leftBranch.centroid.y;
                super.add(leftBranch);
            }

            if (rightBranch.size) {
                rightBranch.position.x = middleOfTheRoad + halfTheRoadLength + rightBranch.centroid.x;
                rightBranch.position.y = containersBottom + rightBranch.centroid.y;
                super.add(rightBranch);
            }

            containersBottom += Math.max(leftBranch.displayDimensions.width, rightBranch.displayDimensions.width);
        }

        // Add Terra Nullius (if required)
        if (this._container.branches.segments.length) {
            containersBottom += this._options['spacer.terranullius'];
        }
        
        // Place Houses, Segment by Segment
        for (var hSeg of this._container.houses.segments) {
            var hKey = String(hSeg),
                leftHouse = this._container.houses.left[hKey],
                rightHouse = this._container.houses.right[hKey];

            if (leftHouse.size) {
                leftHouse.position.x = middleOfTheRoad - halfTheRoadLength - leftHouse.centroid.x;
                leftHouse.position.y = containersBottom + leftHouse.centroid.y;
                super.add(leftHouse);
            }

            if (rightHouse.size) {
                rightHouse.position.x = middleOfTheRoad + halfTheRoadLength + rightHouse.centroid.x;
                rightHouse.position.y = containersBottom + rightHouse.centroid.y;
                super.add(rightHouse);
            }

            containersBottom += Math.max(leftHouse.displayDimensions.width, rightHouse.displayDimensions.width);
        }
    };

    _prepareSegments() {
        var houseOrder = typeof this._options['house.segmentorder'] === 'function' ? this._options['branch.segmentorder'] : function(a, b) {return a - b; };
        var branchOrder = typeof this._options['branch.segmentorder'] === 'function' ? this._options['branch.segmentorder'] : function(a, b) {return a - b; };
        this._container.houses.segments.sort(houseOrder);
        this._container.branches.segments.sort(branchOrder);
    }

    _addHousesToStructure() {
        for (var segment of this._container.houses.segments) {
            var key = String(segment);

            this._distributeShapes(
                this._container.houses.segmented[key],
                this._options['house.distribution'],
                this._container.houses.left[key],
                this._container.houses.right[key]
            );
        }
    };

    _addBranchesToStructure() {
        for (var segment of this._container.branches.segments) {
            var key = String(segment);

            this._distributeShapes(
                this._container.branches.segmented[key],
                this._options['branch.distribution'],
                this._container.branches.left[key],
                this._container.branches.right[key]
            );
        }
    };

    _distributeShapes(shapes, method, left, right) {
        if (typeof method === 'function') {
            this._distributeShapesEquallyByAttribute(shapes, method, left, right);
            return;
        }

        if (typeof method !== 'string') {
            throw 'Unknown type of distribution';
        }

        if (method.toLowerCase() === 'left') {
            this._distributeShapesToContainer(shapes, left);
        } else if (method.toLowerCase() === 'right') {
            this._distributeShapesToContainer(shapes, right);
        } else {
            this._distributeShapesInDefaultOrder(shapes, left, right);
        }
    }

    _distributeShapesToContainer(shapes, container) {
        for (var s of shapes) {
            container.add(s);
        }
    };

    _distributeShapesInDefaultOrder(shapes, left, right) {
        for (var key in shapes) {
            if(shapes.hasOwnProperty(key)) {
                var c = (key%2) ? left : right;
                c.add(shapes[key]);
            }
        }
    };

    _distributeShapesEquallyByAttribute(shapes, attr, left, right) {
        shapes.sort(function (a, b) { return attr(b) - attr(a); });
        var diff = 0;
        for (var s of shapes) {
            if(diff <= 0) {
                left.add(s);
                diff += attr(s);
            } else {
                right.add(s);
                diff -= attr(s);
            }
        }
    }

    _getContainerWidth() {
        var houseWidth = this._getHousesBlockTotalWidth();
        var branchWidth = this._getBranchesBlockTotalWidth();
        var containerMargin = (branchWidth && houseWidth) ? this._options['spacer.terranullius'] : 0;
        return houseWidth + branchWidth + this._options['spacer.initial'] + containerMargin;
    };

    _getHousesBlockTotalWidth(){
        var maxLeftHouses = 0,
            maxRightHouses = 0,
            tmp;

        for (var l in this._container.houses.left) {
            tmp = this._container.houses.left[l].displayDimensions.width;
            if (maxLeftHouses < tmp) {
                maxLeftHouses = tmp;
            }
        }

        for (var r in this._container.houses.right) {
            tmp = this._container.houses.right[r].displayDimensions.width;
            if (maxRightHouses < tmp) {
                maxRightHouses = tmp;
            }
        }

        return Math.max(maxLeftHouses, maxRightHouses);
    }

    _getBranchesBlockTotalWidth(){
        var maxLeftBranches = 0,
            maxRightBranches = 0,
            tmp;

        for (var l in this._container.branches.left) {
            tmp = this._container.branches.left[l].displayDimensions.width;
            if (maxLeftBranches < tmp) {
                maxLeftBranches = tmp;
            }
        }

        for (var r in this._container.branches.right) {
            tmp = this._container.branches.right[r].displayDimensions.width;
            if (maxRightBranches < tmp) {
                maxRightBranches = tmp;
            }
        }

        return Math.max(maxLeftBranches, maxRightBranches);
    }

    _getContainerLength() {
        var leftLength  = this._getLeftBlockLength();
        var rightLength = this._getRightBlockLength();
        
        return leftLength + this._container.road.displayDimensions.length + rightLength;
    };

    _getLeftBlockLength() {
        var maxLeftHouses = 0,
            maxLeftBranches = 0,
            tmp;

        for (var h in this._container.houses.left) {
            tmp = this._container.houses.left[h].displayDimensions.length;
            if (maxLeftHouses < tmp) {
                maxLeftHouses = tmp;
            }
        }

        for (var b in this._container.branches.left) {
            tmp = this._container.branches.left[b].displayDimensions.length;
            if (maxLeftBranches < tmp) {
                maxLeftBranches = tmp;
            }
        }

        return Math.max(maxLeftHouses, maxLeftBranches);
    };

    _getRightBlockLength() {
        var maxRightHouses = 0,
            maxRightBranches = 0,
            tmp;

        for (var h in this._container.houses.right) {
            tmp = this._container.houses.right[h].displayDimensions.length;
            if (maxRightHouses < tmp) {
                maxRightHouses = tmp;
            }
        }

        for (var b in this._container.branches.right) {
            tmp = this._container.branches.right[b].displayDimensions.length;
            if (maxRightBranches < tmp) {
                maxRightBranches = tmp;
            }
        }

        return Math.max(maxRightHouses, maxRightBranches);
    };
}

module.exports = StreetContainer;
