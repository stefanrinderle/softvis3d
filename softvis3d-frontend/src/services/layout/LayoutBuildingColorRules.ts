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
import BuildingColorTheme from "../../classes/BuildingColorTheme";
import { MetricScale } from "./LayoutProcessor";

const attributeHelper = CodeCityVis.helper.attributes;

class LayoutBuildingColorRules {
    private readonly _colorMode: BuildingColorTheme;
    private readonly _metricScale: MetricScale;

    public constructor(metricScale: MetricScale, colorMode: BuildingColorTheme) {
        this._metricScale = metricScale;
        this._colorMode = colorMode;
    }

    /**
     * Package-Name --> Building Color
     * @returns {BaseRule}
     */
    public ruleBuildingColorInitial() {
        return new CodeCityVis.rules.universal({
            condition: (model, node) => !!(model && node.children.length === 0 && node.parent),
            metric: () => {
                return 0xfd8b01;
            },
            attributes: "color",
        });
    }

    /**
     * Package-Name --> Building Color
     * @private
     * @returns {BaseRule}
     */
    public ruleBuildingColorByPackageName() {
        return new CodeCityVis.rules.color.assigned({
            condition: (model, node) => !!(model && node.children.length === 0 && node.parent),
            metric: (model, node): string => {
                return model && String(node.parent);
            },
            attributes: "color",
        });
    }

    /**
     * Lines of Code --> Building Color
     * @private
     * @returns {BaseRule}
     */
    public ruleBuildingColorByLinesOfCode() {
        const minVal = 25;
        let maxVal = this._metricScale.metricColor.max;
        maxVal = Math.max(350, maxVal);
        maxVal = Math.min(900, maxVal);

        return this.createMinMaxRule(minVal, maxVal, this._colorMode, true);
    }

    public ruleBuildingColorByNumberOfAuthors() {
        const minVal = 1;
        const maxVal = 3;

        return this.createMinMaxRule(minVal, maxVal, this._colorMode, false);
    }

    public ruleBuildingColorByNumberOfCommits() {
        const minVal = 1;
        const maxVal = 5;

        return this.createMinMaxRule(minVal, maxVal, this._colorMode, true);
    }

    /**
     * Complexity --> Building Color
     * @private
     * @returns {BaseRule}
     */
    public ruleBuildingColorByComplexity() {
        const minVal = 1;
        const maxVal = this._metricScale.metricColor.max;

        return this.createMinMaxRule(minVal, maxVal, this._colorMode, true);
    }

    /**
     * Issues --> Building Color
     * @private
     * @returns {BaseRule}
     */
    public ruleBuildingColorByCoverage() {
        const minVal = 0;
        const maxVal = 95;

        return this.createMinMaxRule(minVal, maxVal, this._colorMode, false);
    }

    /**
     * Issues --> Building Color
     * @private
     * @returns {BaseRule}
     */
    public ruleBuildingColorByIssues() {
        const minVal = 0;
        let maxVal = this._metricScale.metricColor.max;
        maxVal = Math.max(20, maxVal);
        maxVal = Math.min(180, maxVal);

        return this.createMinMaxRule(minVal, maxVal, this._colorMode, true);
    }

    /**
     * Open Issues --> Building Color
     * @private
     * @returns {BaseRule}
     */
    // eslint-disable-next-line sonarjs/no-identical-functions
    public ruleBuildingColorByOpenIssues() {
        const minVal = 0;
        let maxVal = this._metricScale.metricColor.max;
        maxVal = Math.max(20, maxVal);
        maxVal = Math.min(180, maxVal);

        return this.createMinMaxRule(minVal, maxVal, this._colorMode, true);
    }

    private createMinMaxRule(
        minVal: number,
        maxVal: number,
        colorMode: BuildingColorTheme,
        isMinGood: boolean
    ) {
        return new CodeCityVis.rules.color.gradient({
            condition: (model, node) => model && node.children.length === 0,
            metric: (model, node, version) => {
                const attr = attributeHelper.attrFallbackSweep(model, node, version);
                return "metricColor" in attr ? attr["metricColor"] : 0;
            },
            attributes: "color",
            min: minVal,
            max: maxVal,
            minColor: isMinGood ? colorMode.goodColor : colorMode.badColor,
            maxColor: isMinGood ? colorMode.badColor : colorMode.goodColor,
        });
    }
}

export default LayoutBuildingColorRules;
