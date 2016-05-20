/**
 * Converts the model into a 2D SoftwareCity consisting of SpatialNodes.
 * 
 * @interface
 */
class BaseIllustrator {
    /**
     * @param  {BaseSoftwareModel} model
     * @param  {Object}            options
     * @return {BaseIllustrator}
     */
    constructor(model, options) {};

    /**
     * Add a Metric-Rule, which will create or alter the attributes
     * of the SpatialNodes.
     * @param {function} rule
     */
    addRule(rule) {};

    /**
     * Create the 2D spatial model, using the available information
     * for the chosen version.
     * Returns a list of SpatialNodes, which can be rendered in
     * combination with the model.
     * @param  {Version} version
     * @return {Array}
     */
    draw(version) {};
}

module.exports = BaseIllustrator;
