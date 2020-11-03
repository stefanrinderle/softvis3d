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

/* tslint:disable */

import * as CodeCityVis from "codecity-visualizer";
import HouseColorMode from '../../classes/HouseColorMode';
import {MetricScale} from './LayoutProcessor';

const attributeHelper = CodeCityVis.helper.attributes;

class LayoutHouseColorRules {

    private readonly _colorMode: HouseColorMode;
    private readonly _metricScale: MetricScale;

    public constructor(metricScale: MetricScale, colorMode: HouseColorMode) {
        this._metricScale = metricScale;
        this._colorMode = colorMode;
    }

    /**
     * Package-Name --> Building Color
     * @returns {BaseRule}
     */
    public ruleHouseColorInitial() {
        return new CodeCityVis.rules.universal({
            condition: (model, node) => !!(model && node.children.length === 0 && node.parent),
            metric: () => {
                return 0xFD8B01;
            },
            attributes: "color"
        });
    }

    /**
     * Package-Name --> Building Color
     * @private
     * @returns {BaseRule}
     */
    public ruleHouseColorByPackageName() {
        return new CodeCityVis.rules.color.assigned({
            condition: (model, node) => !!(model && node.children.length === 0 && node.parent),
            metric: (model, node): string => {
                return model && String(node.parent);
            },
            attributes: "color"
        });
    }

    /**
     * Lines of Code --> Building Color
     * @private
     * @returns {BaseRule}
     */
    public ruleHouseColorByLinesOfCode() {
        let minVal = 25;
        let maxVal = this._metricScale.metricColor.max;
        maxVal = Math.max(350, maxVal);
        maxVal = Math.min(900, maxVal);

        return this.createMinMaxRule(minVal, maxVal, this._colorMode);
    }

    /**
     * Issues --> Building Color
     * @private
     * @returns {BaseRule}
     */
    public ruleHouseColorByScmInfos() {
        let minVal = 1;
        let maxVal = 4;

        return this.createMinMaxRule(minVal, maxVal, this._colorMode);
    }

    /**
     * Complexity --> Building Color
     * @private
     * @returns {BaseRule}
     */
    public ruleHouseColorByComplexity() {
        let minVal = 25;
        let maxVal = this._metricScale.metricColor.max;
        maxVal = Math.max(200, maxVal);
        maxVal = Math.min(400, maxVal);

        return this.createMinMaxRule(minVal, maxVal, this._colorMode);
    }

    /**
     * Issues --> Building Color
     * @private
     * @returns {BaseRule}
     */
    public ruleHouseColorByCoverage() {
        let minVal = 0;
        let maxVal = 95;

        return this.createMinMaxRule(minVal, maxVal, this._colorMode);
    }

    /**
     * Issues --> Building Color
     * @private
     * @returns {BaseRule}
     */
    public ruleHouseColorByIssues() {
        let minVal = 0;
        let maxVal = this._metricScale.metricColor.max;
        maxVal = Math.max(20, maxVal);
        maxVal = Math.min(180, maxVal);

        return this.createMinMaxRule(minVal, maxVal, this._colorMode);
    }

    /**
     * Open Issues --> Building Color
     * @private
     * @returns {BaseRule}
     */
    public ruleHouseColorByOpenIssues() {
        let minVal = 0;
        let maxVal = this._metricScale.metricColor.max;
        maxVal = Math.max(20, maxVal);
        maxVal = Math.min(180, maxVal);

        return this.createMinMaxRule(minVal, maxVal, this._colorMode);
    }

    private createMinMaxRule(minVal: number, maxVal: number, colorMode: HouseColorMode) {
        return new CodeCityVis.rules.color.gradient({
            condition: (model, node) => model && node.children.length === 0,
            metric: (model, node, version) => {
                const attr = attributeHelper.attrFallbackSweep(model, node, version);
                return ("metricColor" in attr) ? attr["metricColor"] : 0;
            },
            attributes: "color",
            min: minVal,
            max: maxVal,
            minColor: colorMode.badColor,
            maxColor: colorMode.goodColor
        });
    }
}

export default LayoutHouseColorRules;
