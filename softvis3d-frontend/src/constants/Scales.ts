import Scale from "../classes/Scale";

const LOGARITHMIC: Scale = new Scale("logarithmic", "Logarithmic",
    "Building footprint and height values are calculated using a logarithmic scale " +
    "based the metric min and max values.");
const EXPONENTIAL: Scale = new Scale("exponential", "Exponential",
    "Building footprint and height values are calculated using a exponential scale " +
    "based the metric min and max values.");
const LINEAR_SCALED: Scale = new Scale("linear_s", "Linear (scaled)",
    "Building footprint and height will be scaled linear without a maximum value. " +
    "The max footprint and height is dependent on the metric values.");
const LINEAR: Scale = new Scale("linear", "Linear",
    "Building footprint and height will be scaled linear with a maximum value defined by the plugin. " +
    "The max footprint and height is fixed.");

export {
    LOGARITHMIC,
    EXPONENTIAL,
    LINEAR_SCALED,
    LINEAR
}

export class Scales {

    public static availableScales: Scale[] = [
        LOGARITHMIC,
        EXPONENTIAL,
        LINEAR_SCALED,
        LINEAR
    ];

    public static getScaleById(scaleId: string): Scale | undefined {
        if (!scaleId) {
            return;
        }

        for (const availableScale of Scales.availableScales) {
            if (availableScale.getId() === scaleId) {
                return availableScale;
            }
        }
    }
}