///
/// softvis3d-frontend
/// Copyright (C) 2020 Stefan Rinderle and Yvo Niedrich
/// stefan@rinderle.info / yvo.niedrich@gmail.com
///
/// This program is free software; you can redistribute it and/or
/// modify it under the terms of the GNU Lesser General Public
/// License as published by the Free Software Foundation; either
/// version 3 of the License, or (at your option) any later version.
///
/// This program is distributed in the hope that it will be useful,
/// but WITHOUT ANY WARRANTY; without even the implied warranty of
/// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
/// Lesser General Public License for more details.
///
/// You should have received a copy of the GNU Lesser General Public
/// License along with this program; if not, write to the Free Software
/// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
///

import * as CodeCityVis from "codecity-visualizer";
import { TreeNodeInterface } from "codecity-visualizer/types/interfaces";
import BuildingColorTheme from "../../classes/BuildingColorTheme";
import {
    complexityColorMetric,
    coverageColorMetric,
    leakPeriodCommitsScmColorMetric,
    linesOfCodeColorMetric,
    newIssuesColorMetric,
    numberOfAuthorsScmColorMetric,
    openIssuesColorMetric,
    packageNameColorMetric,
    violationsColorMetric,
} from "../../constants/ColorMetrics";
import LayoutBuildingColorRules from "./LayoutBuildingColorRules";
import Softvis3dModel from "./Softvis3dModel";

const illustratorEvostreet = CodeCityVis.illustrators.evostreet;
const illustratorDistrict = CodeCityVis.illustrators.district;
const attributeHelper = CodeCityVis.helper.attributes;

// type VersionInterface = CodeCityVis.components.version;
interface AttributeContainer {
    [index: string]: any;
}

interface MinMaxValue {
    min: number;
    max: number;
}

export interface MetricScale {
    height: MinMaxValue;
    metricFootprint: MinMaxValue;
    metricColor: MinMaxValue;
}

class LayoutProcessor {
    private _options: {
        layout: string;
        layoutOptions: Record<string, unknown>;
        colorMetric: string;
        scalingMethod: string;
    };
    private _illustrator: any;
    private _rules: CodeCityVis.rules.base[];
    private _metricScale: MetricScale;
    private _buildingColorTheme: BuildingColorTheme;

    public constructor() {
        this._options = {} as any;
        this._rules = [];
        this._metricScale = undefined as any;
        this._buildingColorTheme = undefined as any;
    }

    public getIllustration(options: Record<string, unknown>, model: Softvis3dModel) {
        return new Promise<any>((resolve) => {
            this.setOptions(options);
            // Step 1: Load Metrics Scale
            this._metricScale = model.getMetricScale();
            this._buildingColorTheme = model.getBuildingColorTheme();

            // Step 2: Prepare the layout
            if (this._options.layout === "evostreet") {
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

            setTimeout(() => {
                resolve(illustrator.draw(model._version));
            }, 10);
        });
    }

    private setOptions(options = {}) {
        this._options = Object.assign(
            { layout: "district", layoutOptions: {}, colorMetric: "none", scalingMethod: "linear" },
            options
        );
        this._illustrator = null;
        this._rules = [];
        this._metricScale = {
            height: { min: Infinity, max: 0 },
            metricFootprint: { min: Infinity, max: 0 },
            metricColor: { min: Infinity, max: 0 },
        };
    }

    private setLayoutEvostreet() {
        this._illustrator = illustratorEvostreet;

        this._options.layoutOptions = this._mergeDeep(this._options.layoutOptions, {
            "layout.snail": false,
            "house.margin": 9,
            "highway.length": 50,
            "evostreet.options": {
                "spacer.initial": 30,
                "spacer.terranullius": 40,
                "spacer.conclusive": 0,
                "spacer.branches": 50,
                "road.trim": true,
                "house.container": (key: string, mirror: boolean) =>
                    new CodeCityVis.containers.lightmap(key, mirror),
                "house.distribution": "left",
                "house.platforms": {
                    "dimensions.height": 1,
                    color: 0xd5d5d5,
                },
            },
        });

        this._rules = [];
        this._rules.push(this._RuleBuildingHeight());
        this._rules.push(this._RuleBuildingBase());
        this._rules.push(this._getBuildingColorRule());
        this._rules.push(this._RulePackageColorBlue());
    }

    private setLayoutDistrict() {
        this._illustrator = illustratorDistrict;

        this._options.layoutOptions = this._mergeDeep(this._options.layoutOptions, {
            "layout.tower": false,
            "house.margin": 8,
            "spacer.margin": 25,
            "spacer.padding": 20,
        });

        this._rules = [];
        this._rules.push(this._RuleBuildingHeight());
        this._rules.push(this._RuleBuildingBase());
        this._rules.push(this._getBuildingColorRule());
        this._rules.push(this._RulePackageColorGrey());
    }

    private _mergeDeep(opt: any, newOpt: any) {
        if (typeof newOpt !== "object") {
            throw "Cannot merge non-objects.";
        }

        const merged: { [index: string]: any } = {};

        for (const key in newOpt) {
            if (!Object.prototype.hasOwnProperty.call(newOpt, key)) {
                continue;
            }

            if (typeof newOpt[key] === "object") {
                if (typeof opt[key] !== "object") {
                    opt[key] = {};
                }

                merged[key] = this._mergeDeep(opt[key], newOpt[key]);
            } else {
                merged[key] = newOpt[key];
            }
        }
        return merged;
    }

    private _getBuildingColorRule() {
        const rules = new LayoutBuildingColorRules(this._metricScale, this._buildingColorTheme);
        switch (this._options.colorMetric) {
            case linesOfCodeColorMetric.id:
                return rules.ruleBuildingColorByLinesOfCode();
            case complexityColorMetric.id:
                return rules.ruleBuildingColorByComplexity();
            case coverageColorMetric.id:
                return rules.ruleBuildingColorByCoverage();
            case violationsColorMetric.id:
                return rules.ruleBuildingColorByIssues();
            case newIssuesColorMetric.id:
                return rules.ruleBuildingColorByIssues();
            case openIssuesColorMetric.id:
                return rules.ruleBuildingColorByOpenIssues();
            case packageNameColorMetric.id:
                return rules.ruleBuildingColorByPackageName();
            case numberOfAuthorsScmColorMetric.id:
                return rules.ruleBuildingColorByNumberOfAuthors();
            case leakPeriodCommitsScmColorMetric.id:
                return rules.ruleBuildingColorByNumberOfCommits();
            default:
                return rules.ruleBuildingColorInitial();
        }
    }

    private static readonly dimensionsHeight = "dimensions.height";
    private static readonly dimensionsLength = "dimensions.length";
    private static readonly dimensionsWidth = "dimensions.width";

    /**
     * Height-Metric --> Building Height
     * @private
     * @returns {BaseRule}
     */
    // eslint-disable-next-line sonarjs/cognitive-complexity
    private _RuleBuildingHeight() {
        let max = 450;
        let factor: number;
        let power: number;
        let base: number;

        if (this._options.scalingMethod === "logarithmic") {
            if (this._metricScale.height.max > 1400) {
                // Logarithmic Max: ~2300 ==> 450
                base = 5;
                power = 3.89;
            } else {
                // Logarithmic Max: ~1400 ==> 450
                base = 3.5;
                power = 3.5;
            }

            return new CodeCityVis.rules.math.logarithmic({
                condition: (model, node) => model && node.children.length === 0,
                metric: (model, node, version) => {
                    const attr: AttributeContainer = attributeHelper.attrFallbackSweep(
                        model,
                        node,
                        version
                    );
                    return "height" in attr ? attr["height"] : 0;
                },
                attributes: LayoutProcessor.dimensionsHeight,
                min: 6,
                max,
                logbase: base,
                logexp: power,
            });
        } else if (this._options.scalingMethod === "exponential") {
            factor = 0.5;
            power = Math.log(max / factor) / Math.log(this._metricScale.height.max);

            return new CodeCityVis.rules.math.exponential({
                condition: (model, node) => model && node.children.length === 0,
                metric: (model, node, version) => {
                    const attr = attributeHelper.attrFallbackSweep(model, node, version);
                    return "height" in attr ? attr["height"] : 0;
                },
                attributes: LayoutProcessor.dimensionsHeight,
                min: 6,
                max,
                power,
                factor,
            });
        } else {
            // Linear
            factor = 1;

            if (this._options.scalingMethod === "linear") {
                // Do not Scale Height
                max = Infinity;
            }

            if (this._metricScale.height.max > max) {
                factor = max / this._metricScale.height.max;
            }

            return new CodeCityVis.rules.math.linear({
                condition: (model, node) => model && node.children.length === 0,
                metric: (model, node, version) => {
                    const attr = attributeHelper.attrFallbackSweep(model, node, version);
                    return "height" in attr ? attr["height"] : 0;
                },
                attributes: LayoutProcessor.dimensionsHeight,
                min: 6,
                max,
                factor,
            });
        }
    }

    /**
     * Footprint-Metric --> Building Base
     * @private
     * @returns {BaseRule}
     */
    // eslint-disable-next-line sonarjs/cognitive-complexity
    private _RuleBuildingBase() {
        let max = 450;
        let factor: number;
        let power: number;
        let base: number;

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
                condition: (model, node) => model && node.children.length === 0,
                metric: (model, node, version) => {
                    const attr = attributeHelper.attrFallbackSweep(model, node, version);
                    return "metricFootprint" in attr ? attr["metricFootprint"] : 0;
                },
                attributes: [LayoutProcessor.dimensionsLength, LayoutProcessor.dimensionsWidth],
                min: 10,
                max,
                logbase: base,
                logexp: power,
            });
        } else if (this._options.scalingMethod == "exponential") {
            factor = 0.5;
            power = Math.log(max / factor) / Math.log(this._metricScale.metricFootprint.max);

            return new CodeCityVis.rules.math.exponential({
                condition: (model, node) => model && node.children.length === 0,
                metric: (model, node, version) => {
                    const attr = attributeHelper.attrFallbackSweep(model, node, version);
                    return "metricFootprint" in attr ? attr["metricFootprint"] : 0;
                },
                attributes: [LayoutProcessor.dimensionsLength, LayoutProcessor.dimensionsWidth],
                min: 10,
                max,
                power,
                factor,
            });
        } else {
            // Linear
            factor = 1;

            if (this._options.scalingMethod === "linear") {
                // Do not Scale Base
                max = Infinity;
            }

            if (this._metricScale.metricFootprint.max > max) {
                factor = max / this._metricScale.metricFootprint.max;
            }

            return new CodeCityVis.rules.math.linear({
                condition: (model, node) => model && node.children.length === 0,
                metric: (model, node, version) => {
                    const attr = attributeHelper.attrFallbackSweep(model, node, version);
                    return "metricFootprint" in attr ? attr["metricFootprint"] : 0;
                },
                attributes: [LayoutProcessor.dimensionsLength, LayoutProcessor.dimensionsWidth],
                min: 6,
                max,
                factor,
            });
        }
    }

    /**
     * Package-Depth --> Street Color
     * @private
     * @returns {BaseRule}
     */
    private _RulePackageColorBlue() {
        return new CodeCityVis.rules.color.gradient({
            condition: (model, node) => model && node.children.length !== 0,
            metric: (model, node) => {
                if (!model) return 0;
                let level = 0;
                while ((node = node.parent as TreeNodeInterface)) {
                    level++;
                }
                return level;
            },
            attributes: "color",
            max: 9,
            minColor: 0x157f89,
            maxColor: 0x0b2d5c,
        });
    }

    /**
     * Package-Depth --> Street Color (Grey)
     * @private
     * @returns {BaseRule}
     */
    private _RulePackageColorGrey() {
        return new CodeCityVis.rules.color.gradient({
            condition: (model, node) => model && node.children.length !== 0,
            // eslint-disable-next-line sonarjs/no-identical-functions
            metric: (model, node) => {
                if (!model) return 0;
                let level = 0;
                while ((node = node.parent as TreeNodeInterface)) {
                    level++;
                }
                return level;
            },
            attributes: "color",
            max: 9,
            minColor: 0x202020,
            maxColor: 0xcccccc,
        });
    }
}

export default LayoutProcessor;
