/*
 * softvis3d-frontend
 * Copyright (C) 2016 Stefan Rinderle and Yvo Niedrich
 * stefan@rinderle.info / yvo.niedrich@gmail.com
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
        this._options = Object.assign(
            { layout: 'district', layoutOptions: {}, colorMetric: 'NONE', scalingMethod: 'linear' },
            options
        );
        this._illustrator = null;
        this._rules = [];
        this._metricScale = {};
    }

    getIllustration(model, version) {
        // Step 1: Load Metrics Scale
        this._metricScale = model.getMetricScale();

        // Step 2: Prepare the layout
        if (this._options.layout === 'evostreet') {
            this.setLayoutEvostreet();
        } else {
            this.setLayoutDistrict();
        }

        // Step 3: Create the Layout
        const illustrator = new this._illustrator(model, this._options.layoutOptions);

        // Step 4:
        for (const rule of this._rules) {
            illustrator.addRule(rule);
        }

        return illustrator.draw(version);
    }

    setLayoutEvostreet() {
        this._illustrator = IllustratorEvostreet;

        this._options.layoutOptions = this._mergeDeep(
            this._options.layoutOptions,
            {
                'layout.snail': false,
                'house.margin': 9,
                'highway.length': 50,
                'evostreet.options': {
                    'spacer.initial': 30,
                    "spacer.terranullius": 40,
                    'spacer.conclusive': 0,
                    'spacer.branches': 50,
                    'house.container': function(key, mirror) { return new CodeCityVis.containers.lightmap(key, mirror); },
                    'house.distribution': 'left',
                    'house.platforms': {
                        "dimensions.height": 1,
                        color: 0xD5D5D5
                    }
                }
            }
        );

        this._rules = [];
        this._rules.push(this._RuleHouseHeight());
        this._rules.push(this._RuleHouseBase());
        this._rules.push(this._getHouseColorRule());
        this._rules.push(this._RulePackageColorBlue());
    }

    setLayoutDistrict() {
        this._illustrator = IllustratorDistrict;

        this._options.layoutOptions = this._mergeDeep(
            this._options.layoutOptions,
            {
                'layout.tower': false,
                'house.margin': 8,
                'spacer.margin': 25,
                'spacer.padding': 20
            }
        );

        this._rules = [];
        this._rules.push(this._RuleHouseHeight());
        this._rules.push(this._RuleHouseBase());
        this._rules.push(this._getHouseColorRule());
        this._rules.push(this._RulePackageColorGrey());
    }

    _mergeDeep(opt, newOpt) {
        if (typeof newOpt !== "object") {
            throw "Cannot merge non-objects.";
        }

        var merged = {};

        for (var key in newOpt) {
            if (!newOpt.hasOwnProperty(key)) {
                continue;
            }

            if (typeof newOpt[key] === "object") {
                if (typeof opt[key] !== "object") {
                    opt[key] = {};
                }

                merged[key] = this._mergeDeep(opt[key], newOpt[key])
            } else {
                merged[key] = newOpt[key];
            }
        }
        return merged;
    }

    _getHouseColorRule() {
        switch (this._options.colorMetric) {
            case 'ncloc':
                return this._RuleHouseColorByLinesOfCode();
            case 'complexity':
                return this._RuleHouseColorByComplexity();
            case 'coverage':
                return this._RuleHouseColorByCoverage();
            case 'violations':
                return this._RuleHouseColorByIssues();
            case 'open_issues':
                return this._RuleHouseColorByOpenIssues();
            case 'PACKAGE':
                return this._RuleHouseColorByPackageName();
            default:
                return this._RuleHouseColorInitial();
        }
    }

    /**
     * Height-Metric --> Building Height
     * @private
     * @returns {BaseRule}
     */
    _RuleHouseHeight() {
        var max = 450;
        var factor, power, base;

        if (this._options.scalingMethod == "logarithmic") {
            if (this._metricScale.metricHeight.max > 1400) {
                // Logarithmic Max: ~2300 ==> 450
                base = 5;
                power = 3.89;
            } else {
                // Logarithmic Max: ~1400 ==> 450
                base = 3.5;
                power = 3.5;
            }

            // Logarithmic Max: ~2000 ==> 450
            return new CodeCityVis.rules.math.logarithmic({
                'condition': function (model, node) {
                    return node.children.length === 0;
                },
                'metric': function (model, node, version) {
                    const attr = attributeHelper.attrFallbackSweep(model, node, version);
                    return ('metricHeight' in attr) ? attr.metricHeight : 0;
                },
                'attributes': 'dimensions.height',
                'min': 6,
                'max': 450,
                'logbase': base,
                'logexp': power
            });
        } else if (this._options.scalingMethod == "exponential") {
            factor = 0.5;
            power = Math.log(max / factor) / Math.log(this._metricScale.metricHeight.max);

            return new CodeCityVis.rules.math.exponential({
                'condition': function(model, node) {
                    return node.children.length === 0;
                },
                'metric': function(model, node, version) {
                    const attr = attributeHelper.attrFallbackSweep(model, node, version);
                    return ('metricHeight' in attr) ? attr.metricHeight : 0;
                },
                'attributes': 'dimensions.height',
                'min': 6,
                'max': max,
                'power': power,
                'factor': factor
            });
        } else { // Linear
            factor = 1;

            if (this._options.scalingMethod == "linear") {
                // Do not Scale Height
                max = Infinity;
            }

            if (this._metricScale.metricHeight.max > max) {
                factor = max / this._metricScale.metricHeight.max;
            }

            return new CodeCityVis.rules.math.linear({
                'condition': function(model, node) {
                    return node.children.length === 0;
                },
                'metric': function(model, node, version) {
                    const attr = attributeHelper.attrFallbackSweep(model, node, version);
                    return ('metricHeight' in attr) ? attr.metricHeight : 0;
                },
                'attributes': 'dimensions.height',
                'min': 6,
                'max': max,
                'factor': factor
            });
        }
    }

    /**
     * Footprint-Metric --> Building Base
     * @private
     * @returns {BaseRule}
     */
    _RuleHouseBase() {
        var max = 450;
        var factor, power, base;

        if (this._options.scalingMethod == "logarithmic") {
            if (this._metricScale.metricFootprint.max > 1400) {
                // Logarithmic Max: ~2300 ==> 450
                base = 5;
                power = 3.89;
            } else {
                // Logarithmic Max: ~1400 ==> 450
                base = 3.5;
                power = 3.5;
            }

            return new CodeCityVis.rules.math.logarithmic({
                'condition': function(model, node) {
                    return node.children.length === 0;
                },
                'metric': function(model, node, version) {
                    const attr = attributeHelper.attrFallbackSweep(model, node, version);
                    return ('metricFootprint' in attr) ? attr.metricFootprint : 0;
                },
                'attributes': ['dimensions.length', 'dimensions.width'],
                'min': 10,
                'max': max,
                'logbase': base,
                'logexp': power
            });
        } else if (this._options.scalingMethod == "exponential") {
            factor = 0.5;
            power = Math.log(max / factor) / Math.log(this._metricScale.metricFootprint.max);

            return new CodeCityVis.rules.math.exponential({
                'condition': function(model, node) {
                    return node.children.length === 0;
                },
                'metric': function(model, node, version) {
                    const attr = attributeHelper.attrFallbackSweep(model, node, version);
                    return ('metricFootprint' in attr) ? attr.metricFootprint : 0;
                },
                'attributes': ['dimensions.length', 'dimensions.width'],
                'min': 10,
                'max': max,
                'power': power,
                'factor': factor
            });
        } else { // Linear
            factor = 1;

            if (this._options.scalingMethod == "linear") {
                // Do not Scale Base
                max = Infinity;
            }

            if (this._metricScale.metricFootprint.max > max) {
                factor = max / this._metricScale.metricFootprint.max;
            }

            return new CodeCityVis.rules.math.linear({
                'condition': function(model, node) {
                    return node.children.length === 0;
                },
                'metric': function(model, node, version) {
                    const attr = attributeHelper.attrFallbackSweep(model, node, version);
                    return ('metricFootprint' in attr) ? attr.metricFootprint : 0;
                },
                'attributes': ['dimensions.length', 'dimensions.width'],
                'min': 6,
                'max': max,
                'factor': factor
            });
        }

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
            'minColor': 0x202020,
            'maxColor': 0xCCCCCC
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
        var minVal = 25;
        var maxVal = this._metricScale.metricColor.max;
        maxVal = Math.max(350, maxVal);
        maxVal = Math.min(900, maxVal);

        return new CodeCityVis.rules.color.gradient({
            'condition': function(model, node) {
                return node.children.length === 0;
            },
            'metric': function(model, node, version) {
                const attr = attributeHelper.attrFallbackSweep(model, node, version);
                return ('metricColor' in attr) ? attr.metricColor : 0;
            },
            'attributes': 'color',
            'min': minVal,
            'max': maxVal,
            'minColor': 0x00CC00,
            'maxColor': 0xEE0000
        });
    }

    /**
     * Complexity --> Building Color
     * @private
     * @returns {BaseRule}
     */
    _RuleHouseColorByComplexity() {
        var minVal = 25;
        var maxVal = this._metricScale.metricColor.max;
        maxVal = Math.max(200, maxVal);
        maxVal = Math.min(400, maxVal);

        return new CodeCityVis.rules.color.gradient({
            'condition': function(model, node) {
                return node.children.length === 0;
            },
            'metric': function(model, node, version) {
                const attr = attributeHelper.attrFallbackSweep(model, node, version);
                return ('metricColor' in attr) ? attr.metricColor : 0;
            },
            'attributes': 'color',
            'min': minVal,
            'max': maxVal,
            'minColor': 0x00CC00,
            'maxColor': 0xEE0000
        });
    }

    /**
     * Issues --> Building Color
     * @private
     * @returns {BaseRule}
     */
    _RuleHouseColorByCoverage() {
        var minVal = 0;
        var maxVal = 95;

        return new CodeCityVis.rules.color.gradient({
            'condition': function(model, node) {
                return node.children.length === 0;
            },
            'metric': function(model, node, version) {
                const attr = attributeHelper.attrFallbackSweep(model, node, version);
                return ('metricColor' in attr) ? attr.metricColor : 0;
            },
            'attributes': 'color',
            'min': minVal,
            'max': maxVal,
            'minColor': 0xEE0000,
            'maxColor': 0x00CC00
        });
    }

    /**
     * Issues --> Building Color
     * @private
     * @returns {BaseRule}
     */
    _RuleHouseColorByIssues() {
        var minVal = 0;
        var maxVal = this._metricScale.metricColor.max;
        maxVal = Math.max(20, maxVal);
        maxVal = Math.min(180, maxVal);

        return new CodeCityVis.rules.color.gradient({
            'condition': function(model, node) {
                return node.children.length === 0;
            },
            'metric': function(model, node, version) {
                const attr = attributeHelper.attrFallbackSweep(model, node, version);
                return ('metricColor' in attr) ? attr.metricColor : 0;
            },
            'attributes': 'color',
            'min': minVal,
            'max': maxVal,
            'minColor': 0x00CC00,
            'maxColor': 0xEE0000
        });
    }

    /**
     * Open Issues --> Building Color
     * @private
     * @returns {BaseRule}
     */
    _RuleHouseColorByOpenIssues() {
        var minVal = 0;
        var maxVal = this._metricScale.metricColor.max;
        maxVal = Math.max(20, maxVal);
        maxVal = Math.min(180, maxVal);

        return new CodeCityVis.rules.color.gradient({
            'condition': function(model, node) {
                return node.children.length === 0;
            },
            'metric': function(model, node, version) {
                const attr = attributeHelper.attrFallbackSweep(model, node, version);
                return ('metricColor' in attr) ? attr.metricColor : 0;
            },
            'attributes': 'color',
            'min': minVal,
            'max': maxVal,
            'minColor': 0x00CC00,
            'maxColor': 0xEE0000
        });
    }
}

module.exports = LayoutProcessor;
