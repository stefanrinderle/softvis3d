var MirrorContainer = require("./base-mirror.js");
var Lighttree       = require("./helper/lighttree.js");
var Cuboid          = require("../components/cuboid.js");
var Point           = require("../components/point.js");

/**
 * Rows Elements one after the other
 *
 * @todo seperator-attribut!
 * 
 * @implements MirrorContainer
 * @implements BaseContainer
 * @implements BaseShape
 */
class Lightmap extends MirrorContainer {

    constructor(key, mirror = false) {
        super(key, mirror);
        this._optimalAspectRatio = 1.0;
        this._currentDimensions = null;
        this._cutHorizontal = true;
    };

    _finalize() {
        super._finalize();
        
        if (!this.size) {
            return;
        }
        this._currentDimensions = new Cuboid();

        var shapes = this.shapes;

        if (this._cutHorizontal) {
            shapes.sort(function(a, b) { return b.displayDimensions.width - a.displayDimensions.width});
        } else {
            shapes.sort(function(a, b) { return b.displayDimensions.length - a.displayDimensions.length});
        }
        

        var origin = new Point();
        var worstDimensions = new Cuboid();

        for (var shape of this.shapes) {
            worstDimensions.length += Math.ceil(shape.displayDimensions.length);
            worstDimensions.width  += Math.ceil(shape.displayDimensions.width);
            worstDimensions.height = Math.max(shape.displayDimensions.height, worstDimensions.height);
        }

        var tree = new Lighttree(origin, worstDimensions);

        for (var s of this.shapes) {
            this._addShapeToTree(s, tree);
        }


        this._calcualteFinalDimensions();
        this._positionShapes(tree);
    };

    _addShapeToTree(shape, tree) {
        var shapeDimensions = shape.displayDimensions;
        var candidates = [];
        tree.collectCandidates(candidates, shapeDimensions);
        
        // Find the best possible Candidate
        // 
        // Preserver => If possible preserve the current Dimensions and 
        //              choose the candidate, that would be the most perfect fit
        // 
        // Expander => If an Expansion is required, prefer the candidate that would result
        //             in the best aspect ratio
        var bestPossibleRatio = Infinity;
        var bestPossibleSpace = Infinity;
        var expander = null;
        var preserver = null;

        for (var c of candidates) {
            var newLength = Math.max(c.origin.x + shapeDimensions.length, this._currentDimensions.length);
            var newWidth  = Math.max(c.origin.y + shapeDimensions.width,  this._currentDimensions.width);

            var canPreserveDimensions = (newLength === this._currentDimensions.length && newWidth === this._currentDimensions.width);

            if (preserver && !canPreserveDimensions) {
                continue;
            }

            if (canPreserveDimensions) {
                var candidateLength = Math.min(c.dimensions.length, this._currentDimensions.length - c.origin.x);
                var candidateWidth  = Math.min(c.dimensions.width, this._currentDimensions.width - c.origin.y);
                var wastedSpace = (candidateWidth * candidateLength) - (shapeDimensions.length * shapeDimensions.width);

                if (wastedSpace < bestPossibleSpace) {
                    bestPossibleSpace = wastedSpace;
                    preserver = c;
                }

            } else {
                var candidatesAspectRatio = Math.max(newLength, newWidth) / Math.min(newLength, newWidth);

                if (candidatesAspectRatio < bestPossibleRatio) {
                    bestPossibleRatio = candidatesAspectRatio;
                    expander = c;
                }
            }
        }

        var winner = preserver ? preserver : expander;

        // Insert Shape into the candidate and update current dimensions
        winner.insert(shapeDimensions, shape, this._cutHorizontal);
        this._currentDimensions.length = Math.max(winner.origin.x + shapeDimensions.length, this._currentDimensions.length);
        this._currentDimensions.width  = Math.max(winner.origin.y + shapeDimensions.width,  this._currentDimensions.width);
        this._currentDimensions.height = Math.max(winner.origin.z + shapeDimensions.height, this._currentDimensions.height);
    };

    _calcualteFinalDimensions() {
        this.dimensions.length = this._currentDimensions.length
        this.dimensions.width  = this._currentDimensions.width
        this.dimensions.height = this._currentDimensions.height
    }

    _positionShapes(tree) {
        var containers = [];
        tree.collectNodesWithContent(containers);

        for(var node of containers) {
            var shape = node.content;

            var relativeYPos = node.origin.y + (shape.displayDimensions.width / 2);
            var containerYCentroid = this.dimensions.width / 2;

            shape.position.x = node.origin.x + (shape.displayDimensions.length - this.dimensions.length) / 2;
            shape.position.y = this.isMirrored ? (containerYCentroid - relativeYPos) : (relativeYPos - containerYCentroid);
        }
    };
};

module.exports = Lightmap;
