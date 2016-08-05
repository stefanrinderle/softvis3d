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
var IllustratorEvostreet = CodeCityVis.illustrators.evostreet;
var IllustratorDistrict = CodeCityVis.illustrators.district;
var attributeHelper = CodeCityVis.helper.attributes;

class LayoutProcessor {

    constructor(options = {}) {
        this._rules = [];
        this._options = Object.assign(
            { layout: 'district', layoutOptions: {}, colorMetric: 'NONE' },
            options
        );

        if (this._options.layout === 'evostreet') {
            this.setLayoutEvostreet();
        } else {
            this.setLayoutDistrict();
        }
    }

    setLayoutEvostreet() {
        this._illustrator = IllustratorEvostreet;

        this._options.layoutOptions = {
            'layout.snail': false,
            'house.margin': 6,
            'highway.length': 50,
            'evostreet.options': {
                'spacer.initial': 30,
                "spacer.terranullius": 40,
                'spacer.conclusive': 0,
                'spacer.branches': 50,
                'house.container': CodeCityVis.containers.lightmap,
                'house.distribution': 'default',
                'house.platforms': {
                    color: 0xD5D5D5
                }
            }
        };


        this._rules.push(this._RuleHouseHeight());
        this._rules.push(this._RuleHouseBase());
        this._rules.push(this._getHouseColorRule());
        this._rules.push(this._RulePackageColorBlue());
    }

    setLayoutDistrict() {
        this._illustrator = IllustratorDistrict;

        this._options.layoutOptions = {
            'layout.tower': false,
            'house.margin': 6,
            'spacer.margin': 25,
            'spacer.padding': 15
        };

        this._rules.push(this._RuleHouseHeight());
        this._rules.push(this._RuleHouseBase());
        this._rules.push(this._getHouseColorRule());
        this._rules.push(this._RulePackageColorGrey());
    }

    _getHouseColorRule() {
        switch (this._options.colorMetric) {
            case 'ncloc':
                return this._RuleHouseColorByLinesOfCode();
            case 'complexity':
                return this._RuleHouseColorByComplexity();
            case 'PACKAGE':
                return this._RuleHouseColorByPackageName();
            default:
                return this._RuleHouseColorInitial();
        }
    }

    getIllustration(model, version) {
        const illustrator = new this._illustrator(model, this._options.layoutOptions);

        for (const rule of this._rules) {
            illustrator.addRule(rule);
        }

        return illustrator.draw(version);
    }

    /**
     * Height-Metric --> Building Height
     * @private
     * @returns {BaseRule}
     */
    _RuleHouseHeight() {
        return new CodeCityVis.rules.math.logarithmic({
            'condition': function(model, node) {
                return node.children.length === 0;
            },
            'metric': function(model, node, version) {
                const attr = attributeHelper.attrFallbackSweep(model, node, version);
                return ('metricHeight' in attr) ? attr.metricHeight : 0;
            },
            'attributes': 'dimensions.height',
            'min': 4,
            'max': 350,
            'logbase': 3.40,
            'logexp': 3.25
        });
    }

    /**
     * Footprint-Metric --> Building Base
     * @private
     * @returns {BaseRule}
     */
    _RuleHouseBase() {
        return new CodeCityVis.rules.math.logarithmic({
            'condition': function(model, node) {
                return node.children.length === 0;
            },
            'metric': function(model, node, version) {
                const attr = attributeHelper.attrFallbackSweep(model, node, version);
                return ('metricFootprint' in attr) ? attr.metricFootprint : 0;
            },
            'attributes': ['dimensions.length', 'dimensions.width'],
            'min': 14,
            'max': 250,
            'logbase': 3.60,
            'logexp': 3.2
        });
    }

    /**
     * Package-Depth --> Street Color
     * @private
     * @returns {BaseRule}
     */
    _RulePackageColorBlue() {
        return new CodeCityVis.rules.color.gradient({
            'condition': function(model, node) {
                return node.children.length !== 0;
            },
            'metric': function(model, node) {
                let level = 0;
                while(node = node.parent) {
                    level++;
                }
                return level;
            },
            'attributes': 'color',
            'max': 9,
            'minColor': 0x157f89,
            'maxColor': 0x0b2d5c
        });
    }

    /**
     * Package-Depth --> Street Color (Grey)
     * @private
     * @returns {BaseRule}
     */
    _RulePackageColorGrey() {
        return new CodeCityVis.rules.color.gradient({
            'condition': function(model, node) {
                return node.children.length !== 0;
            },
            'metric': function(model, node) {
                let level = 0;
                while(node = node.parent) {
                    level++;
                }
                return level;
            },
            'attributes': 'color',
            'max': 9,
            'minColor': 0x252525,
            'maxColor': 0xEEEEEE
        });
    }


    /* ####################################################### *
     * ################ HOUSE COLORS ######################### *
     * ####################################################### */

    /**
     * Package-Name --> Building Color
     * @private
     * @returns {BaseRule}
     */
    _RuleHouseColorInitial() {
        return new CodeCityVis.rules.universal({
            'condition': function(model, node) {
                return node.children.length === 0 && node.parent;
            },
            'metric': function() {
                // return 0x666666;
                return 0xFD8B01;
            },
            'attributes': 'color'
        });
    }
    
    /**
     * Package-Name --> Building Color
     * @private
     * @returns {BaseRule}
     */
    _RuleHouseColorByPackageName() {
        return new CodeCityVis.rules.color.assigned({
            'condition': function(model, node) {
                return node.children.length === 0 && node.parent;
            },
            'metric': function(model, node) {
                return String(node.parent);
            },
            'attributes': 'color'
        });
    }

    /**
     * Lines of Code --> Building Color
     * @private
     * @returns {BaseRule}
     */
    _RuleHouseColorByLinesOfCode() {
        return new CodeCityVis.rules.color.gradient({
            'condition': function(model, node) {
                return node.children.length === 0;
            },
            'metric': function(model, node, version) {
                const attr = attributeHelper.attrFallbackSweep(model, node, version);
                return ('metricColor' in attr) ? attr.metricColor : 0;
            },
            'attributes': 'color',
            'min': 25,
            'max': 750,
            'minColor': 0x00CC00,
            'maxColor': 0xFF0000
        });
    }

    /**
     * Complexity --> Building Color
     * @private
     * @returns {BaseRule}
     */
    _RuleHouseColorByComplexity() {
        return new CodeCityVis.rules.color.gradient({
            'condition': function(model, node) {
                return node.children.length === 0;
            },
            'metric': function(model, node, version) {
                const attr = attributeHelper.attrFallbackSweep(model, node, version);
                return ('metricColor' in attr) ? attr.metricColor : 0;
            },
            'attributes': 'color',
            'min': 25,
            'max': 350,
            'minColor': 0x00CC00,
            'maxColor': 0xFF0000
        });
    }
}

module.exports = LayoutProcessor;
