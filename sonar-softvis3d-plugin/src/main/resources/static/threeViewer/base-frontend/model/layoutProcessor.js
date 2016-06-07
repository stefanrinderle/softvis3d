/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2016 Stefan Rinderle
 * stefan@rinderle.info
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
 */
var CodeCityVis = require('codecity-visualizer');
var Illustrator = CodeCityVis.illustrators.evostreet;
var attributeHelper = CodeCityVis.helper['attribute-extractor'];

class LayoutProcessor {

    constructor() {
    }

    getIllustration(model, version) {
        /* Step 2: Generate a CodeCity from Model
         * - Configure Illustrator Layout (Options)
         * - Decide on Metrics to use (Rules)
         * - Draw a specific Version of the City
         */
        var options = {
            'highway.color': 0x157f89,
            'street.color': 0x156289,
            'house.margin': 5,
            'evostreet.options': {
                'spacer.initial': 30,
                'spacer.conclusive': 0,
                'spacer.branches': 25,
                'house.container': CodeCityVis.containers.lightmap,
                'house.distribution': 'left'
            }
        };

          var illustrator = new Illustrator(model, options);

          illustrator.addRule(this._Rule1());
          illustrator.addRule(this._Rule2());
          illustrator.addRule(this._Rule3());
          illustrator.addRule(this._Rule4());

          return illustrator.draw(version);
    }

    /**
     * Height-Metric --> Building Height
     * @private
     * @returns {BaseRule}
     */
    _Rule1() {
        return new CodeCityVis.rules.math.logarithmic({
            'condition': function(model, node) {
                return node.children.length === 0;
            },
            'metric': function(model, node, version) {
                const attr = attributeHelper.attrFallbackSweep(model, node, version);
                return ('metricHeight' in attr) ? attr.metricHeight : 0;
            },
            'attributes': 'dimensions.height',
            'min': 10,
            'max': 260,
            'logexp': 2.75,
            'logbase': 2.75
        });
    }

    /**
     * Footprint-Metric --> Building Base
     * @private
     * @returns {BaseRule}
     */
    _Rule2() {
        return new CodeCityVis.rules.math.logarithmic({
            'condition': function(model, node, version) {
                return node.children.length === 0;
            },
            'metric': function(model, node, version) {
                const attr = attributeHelper.attrFallbackSweep(model, node, version);
                return ('metricFootprint' in attr) ? attr.metricFootprint : 0;
            },
            'attributes': ['dimensions.length', 'dimensions.width'],
            'min': 10,
            'max': 100,
            'logexp': 3.1,
            'logbase': 4.5
        });
    }

    /**
     * Package-Name --> Building Color
     * @private
     * @returns {BaseRule}
     */
    _Rule3() {
        return new CodeCityVis.rules.color.assigned({
            'condition': function(model, node, version) {
                return node.children.length === 0 && node.parent;
            },
            'metric': function(model, node, version) {
                return String(node.parent);
            },
            'attributes': 'color'
        });
    }

    /**
     * Package-Depth --> Street Color
     * @private
     * @returns {BaseRule}
     */
    _Rule4() {
        return new CodeCityVis.rules.color.gradient({
            'condition': function(model, node, version) {
                return node.children.length !== 0;
            },
            'metric': function(model, node, version) {
                let level = 0;
                while(node = node.parent) {
                    level++;
                }
                return Math.min(level, 10);
            },
            'attributes': 'color',
            'max': 10,
            'minColor': 0x157f89,
            'maxColor': 0x0b2d5c
        });
    }

}

module.exports = LayoutProcessor;
