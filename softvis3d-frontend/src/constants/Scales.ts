import Scale from "../classes/Scale";

const LOGARITHMIC: Scale = new Scale("logarithmic", "Logarithmic",
    "Building footprint and height values are calculated using a logarithmic scale " +
    "based the projects most degenerate file");
const EXPONENTIAL: Scale = new Scale("exponential", "Exponential",
    "Building footprint and height values are calculated using a exponential scale " +
    "based the projects most degenerate file");
const LINEAR_SCALED: Scale = new Scale("linear_s", "Linear (scaled)",
    "Building footprint and height will be scaled linearly. If a file's metric value exceeds " +
    " a maximum value the whole project will be scaled down.");
const LINEAR: Scale = new Scale("linear", "Linear",
    "Building footprint and height will be scaled linearly without a maximum value.");

export {
    LOGARITHMIC,
    EXPONENTIAL,
    LINEAR_SCALED,
    LINEAR
};

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
            if (availableScale.id === scaleId) {
                return availableScale;
            }
        }
    }
}