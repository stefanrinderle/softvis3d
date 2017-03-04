import Metric from "../classes/Metric";
import Layout from "../classes/Layout";
import Scale from "../classes/Scale";
import ColorMetric from "../classes/ColorMetric";

export default class VisualizationLinkParams {

    private _metricFootprint: Metric;
    private _metricHeight: Metric;
    private _metricColor: ColorMetric;
    private _layout: Layout;
    private _scale: Scale;

    constructor(metricFootprint: Metric, metricHeight: Metric, metricColor: ColorMetric, layout: Layout, scale: Scale) {
        this._metricFootprint = metricFootprint;
        this._metricHeight = metricHeight;
        this._metricColor = metricColor;
        this._layout = layout;
        this._scale = scale;
    }

    public getKeyValuePairs() {
        return {
            metricFootprint: this._metricFootprint.id,
            metricHeight: this._metricHeight.id,
            metricColor: this._metricColor.id,
            layout: this._layout.id,
            scale: this._scale.getId()
        };
    }

    get metricFootprint(): Metric {
        return this._metricFootprint;
    }

    get metricHeight(): Metric {
        return this._metricHeight;
    }

    get metricColor(): ColorMetric {
        return this._metricColor;
    }

    get layout(): Layout {
        return this._layout;
    }

    get scale(): Scale {
        return this._scale;
    }

}